#!/usr/bin/env bash
set -e

# 1) Make dotnet folder and project subfolder
rm -rf dotnet
mkdir -p dotnet/src/Pokedex.API
cd dotnet

# 2) Write the correct csproj
cat > src/Pokedex.API/Pokedex.API.csproj << 'EOF'
<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <NoWarn>NU1605</NoWarn>
    <TargetFramework>net7.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
    <IsPackable>true</IsPackable>
    <Authors>Son Nguyen</Authors>
    <PackageId>Pokedex.API</PackageId>
    <Version>1.0.0</Version>
    <Description>Pokédex backend with MongoDB and PokeAPI integration</Description>
    <PackageTags>pokedex;pokeapi;dotnet;api;mongodb;jwt</PackageTags>
    <RepositoryUrl>https://github.com/hoangsonww/The-Pokedex-Database</RepositoryUrl>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="MongoDB.Driver" Version="2.22.0" />
    <PackageReference Include="Swashbuckle.AspNetCore" Version="6.4.0" />
    <PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="7.0.0" />
    <PackageReference Include="System.IdentityModel.Tokens.Jwt" Version="6.15.1" />
  </ItemGroup>
</Project>
EOF

# 3) Program.cs
cat > src/Pokedex.API/Program.cs << 'EOF'
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using Pokedex.API.Data;
using Pokedex.API.Repositories;
using Pokedex.API.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// MongoDB
builder.Services.Configure<MongoSettings>(builder.Configuration.GetSection("MongoSettings"));
builder.Services.AddSingleton<IMongoClient>(sp => {
  var cfg = sp.GetRequiredService<Microsoft.Extensions.Options.IOptions<MongoSettings>>().Value;
  return new MongoClient(cfg.ConnectionString);
});
builder.Services.AddScoped(sp => {
  var cfg = sp.GetRequiredService<Microsoft.Extensions.Options.IOptions<MongoSettings>>().Value;
  return sp.GetRequiredService<IMongoClient>().GetDatabase(cfg.DatabaseName);
});

// Repos & Services
builder.Services.AddScoped<IGenericRepository<Pokemon>, PokemonRepository>();
builder.Services.AddScoped<IGenericRepository<Item>,    ItemRepository>();
builder.Services.AddScoped<IUserRepository,             UserRepository>();
builder.Services.AddScoped<IPokemonService,             PokemonService>();
builder.Services.AddScoped<IItemService,                ItemService>();
builder.Services.AddScoped<IAuthService,                AuthService>();

// JWT
var key = Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!);
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
  .AddJwtBearer(opts => {
    opts.RequireHttpsMetadata = false;
    opts.SaveToken = true;
    opts.TokenValidationParameters = new TokenValidationParameters {
      ValidateIssuer = false,
      ValidateAudience = false,
      ValidateLifetime = true,
      IssuerSigningKey = new SymmetricSecurityKey(key),
      ValidateIssuerSigningKey = true
    };
  });

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
app.UseSwagger(); app.UseSwaggerUI();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
EOF

# 4) appsettings.json
cat > src/Pokedex.API/appsettings.json << 'EOF'
{
  "MongoSettings": {
    "ConnectionString": "mongodb://localhost:27017",
    "DatabaseName": "PokedexDb"
  },
  "Jwt": {
    "Key": "REPLACE_WITH_A_SECURE_RANDOM_KEY"
  }
}
EOF

# 5) Folders
mkdir -p src/Pokedex.API/{Data,Models,Repositories,Services,Controllers}

# 6) Data/MongoSettings.cs
cat > src/Pokedex.API/Data/MongoSettings.cs << 'EOF'
namespace Pokedex.API.Data {
  public class MongoSettings {
    public string ConnectionString { get; set; } = null!;
    public string DatabaseName     { get; set; } = null!;
  }
}
EOF

# 7) Models
cat > src/Pokedex.API/Models/Pokemon.cs << 'EOF'
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Pokedex.API.Models {
  public class Pokemon {
    [BsonId] public ObjectId Id       { get; set; }
    public int      PokeId             { get; set; }
    public string   Name               { get; set; } = null!;
    public string   SpriteUrl          { get; set; } = null!;
  }
}
EOF

cat > src/Pokedex.API/Models/Item.cs << 'EOF'
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Pokedex.API.Models {
  public class Item {
    [BsonId] public ObjectId Id       { get; set; }
    public int      ItemId             { get; set; }
    public string   Name               { get; set; } = null!;
    public string   SpriteUrl          { get; set; } = null!;
  }
}
EOF

cat > src/Pokedex.API/Models/User.cs << 'EOF'
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Pokedex.API.Models {
  public class User {
    [BsonId] public ObjectId Id        { get; set; }
    public string   Username           { get; set; } = null!;
    public string   PasswordHash       { get; set; } = null!;
  }
}
EOF

# 8) Repositories
cat > src/Pokedex.API/Repositories/IGenericRepository.cs << 'EOF'
using MongoDB.Bson;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Pokedex.API.Repositories {
  public interface IGenericRepository<T> {
    Task<List<T>> GetAllAsync();
    Task<T?>      GetByIdAsync(ObjectId id);
    Task          AddAsync(T e);
    Task          UpdateAsync(ObjectId id, T e);
    Task          DeleteAsync(ObjectId id);
  }
}
EOF

cat > src/Pokedex.API/Repositories/PokemonRepository.cs << 'EOF'
using MongoDB.Bson;
using MongoDB.Driver;
using Pokedex.API.Data;
using Pokedex.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Pokedex.API.Repositories {
  public class PokemonRepository : IGenericRepository<Pokemon> {
    private readonly IMongoCollection<Pokemon> _col;
    public PokemonRepository(IMongoDatabase db) => _col = db.GetCollection<Pokemon>("Pokemons");
    public Task<List<Pokemon>> GetAllAsync() => _col.Find(_ => true).ToListAsync();
    public Task<Pokemon?>     GetByIdAsync(ObjectId id) => _col.Find(x=>x.Id==id).FirstOrDefaultAsync();
    public Task                AddAsync(Pokemon e) => _col.InsertOneAsync(e);
    public Task                UpdateAsync(ObjectId id, Pokemon e) => _col.ReplaceOneAsync(x=>x.Id==id,e);
    public Task                DeleteAsync(ObjectId id) => _col.DeleteOneAsync(x=>x.Id==id);
  }
}
EOF

cat > src/Pokedex.API/Repositories/ItemRepository.cs << 'EOF'
using MongoDB.Bson;
using MongoDB.Driver;
using Pokedex.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Pokedex.API.Repositories {
  public class ItemRepository : IGenericRepository<Item> {
    private readonly IMongoCollection<Item> _col;
    public ItemRepository(IMongoDatabase db) => _col = db.GetCollection<Item>("Items");
    public Task<List<Item>> GetAllAsync() => _col.Find(_ => true).ToListAsync();
    public Task<Item?>      GetByIdAsync(ObjectId id) => _col.Find(x=>x.Id==id).FirstOrDefaultAsync();
    public Task              AddAsync(Item e) => _col.InsertOneAsync(e);
    public Task              UpdateAsync(ObjectId id, Item e) => _col.ReplaceOneAsync(x=>x.Id==id,e);
    public Task              DeleteAsync(ObjectId id) => _col.DeleteOneAsync(x=>x.Id==id);
  }
}
EOF

cat > src/Pokedex.API/Repositories/UserRepository.cs << 'EOF'
using MongoDB.Driver;
using Pokedex.API.Models;
using System.Threading.Tasks;

namespace Pokedex.API.Repositories {
  public interface IUserRepository {
    Task<User?> GetByUsernameAsync(string u);
    Task       AddAsync(User u);
  }

  public class UserRepository : IUserRepository {
    private readonly IMongoCollection<User> _col;
    public UserRepository(IMongoDatabase db) => _col = db.GetCollection<User>("Users");
    public Task<User?> GetByUsernameAsync(string u) => _col.Find(x=>x.Username==u).FirstOrDefaultAsync();
    public Task       AddAsync(User u) => _col.InsertOneAsync(u);
  }
}
EOF

# 9) Services (with proper DTOs)
cat > src/Pokedex.API/Services/PokemonService.cs << 'EOF'
using Pokedex.API.Models;
using Pokedex.API.Repositories;
using System.Net.Http.Json;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Pokedex.API.Services {
  public interface IPokemonService {
    Task<IEnumerable<Pokemon>> ListAsync();
    Task<Pokemon?>             GetAsync(string name);
    Task SeedFromApiAsync();
  }

  public class PokemonService : IPokemonService {
    private readonly IGenericRepository<Pokemon> _repo;
    private readonly HttpClient _http = new();
    public PokemonService(IGenericRepository<Pokemon> repo) => _repo = repo;

    public Task<IEnumerable<Pokemon>> ListAsync() =>
      _repo.GetAllAsync().ContinueWith(t=>(IEnumerable<Pokemon>)t.Result);

    public async Task<Pokemon?> GetAsync(string name) {
      var all = await _repo.GetAllAsync();
      return all.Find(p=>p.Name==name);
    }

    public async Task SeedFromApiAsync() {
      var list = await _http.GetFromJsonAsync<PokeList>("https://pokeapi.co/api/v2/pokemon?limit=1000");
      foreach(var r in list.Results) {
        var d = await _http.GetFromJsonAsync<PokeDetail>(r.Url);
        await _repo.AddAsync(new Pokemon {
          PokeId    = d.Id,
          Name      = d.Name!,
          SpriteUrl = d.Sprites.FrontDefault!
        });
      }
    }

    record PokeList(int Count, List<PokeRef> Results);
    record PokeRef(string Name, string Url);
    record PokeDetail(int Id, string? Name, Spr Sprites);
    record Spr(string? FrontDefault);
  }
}
EOF

cat > src/Pokedex.API/Services/ItemService.cs << 'EOF'
using Pokedex.API.Models;
using Pokedex.API.Repositories;
using System.Net.Http.Json;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Pokedex.API.Services {
  public interface IItemService {
    Task<IEnumerable<Item>> ListAsync();
    Task SeedFromApiAsync();
  }

  public class ItemService : IItemService {
    private readonly IGenericRepository<Item> _repo;
    private readonly HttpClient _http = new();
    public ItemService(IGenericRepository<Item> repo) => _repo = repo;

    public Task<IEnumerable<Item>> ListAsync() =>
      _repo.GetAllAsync().ContinueWith(t=>(IEnumerable<Item>)t.Result);

    public async Task SeedFromApiAsync() {
      var list = await _http.GetFromJsonAsync<ItemList>("https://pokeapi.co/api/v2/item?limit=1000");
      foreach(var r in list.Results) {
        var d = await _http.GetFromJsonAsync<ItemDetail>(r.Url);
        await _repo.AddAsync(new Item {
          ItemId    = d.Id,
          Name      = d.Name!,
          SpriteUrl = d.Sprites.Default!
        });
      }
    }

    record ItemList(int Count, List<ItemRef> Results);
    record ItemRef(string Name, string Url);
    record ItemDetail(int Id, string? Name, Spr Sprites);
    record Spr(string? Default);
  }
}
EOF

cat > src/Pokedex.API/Services/AuthService.cs << 'EOF'
using Pokedex.API.Models;
using Pokedex.API.Repositories;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Pokedex.API.Services {
  public interface IAuthService {
    Task<string> RegisterAsync(string u, string p);
    Task<string> LoginAsync(string u, string p);
  }

  public class AuthService : IAuthService {
    private readonly IUserRepository _users;
    private readonly string _key;
    public AuthService(IUserRepository users, IConfiguration cfg) {
      _users = users; _key = cfg["Jwt:Key"]!;
    }

    public async Task<string> RegisterAsync(string u, string p) {
      var h = Convert.ToBase64String(System.Security.Cryptography.SHA256.HashData(Encoding.UTF8.GetBytes(p)));
      await _users.AddAsync(new User { Username=u, PasswordHash=h });
      return await LoginAsync(u,p);
    }

    public async Task<string> LoginAsync(string u, string p) {
      var user = await _users.GetByUsernameAsync(u) ?? throw new Exception("Invalid");
      var h = Convert.ToBase64String(System.Security.Cryptography.SHA256.HashData(Encoding.UTF8.GetBytes(p)));
      if(h!=user.PasswordHash) throw new Exception("Invalid");
      var tokenHandler = new JwtSecurityTokenHandler();
      var key = Encoding.UTF8.GetBytes(_key);
      var token = new JwtSecurityToken(claims:new[]{ new Claim(ClaimTypes.Name,u) },
        expires:DateTime.UtcNow.AddHours(2),
        signingCredentials:new SigningCredentials(new SymmetricSecurityKey(key),SecurityAlgorithms.HmacSha256));
      return tokenHandler.WriteToken(token);
    }
  }
}
EOF

# 10) Controllers
cat > src/Pokedex.API/Controllers/PokemonsController.cs << 'EOF'
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pokedex.API.Models;
using Pokedex.API.Services;

namespace Pokedex.API.Controllers {
  [ApiController]
  [Route("api/pokemons")]
  public class PokemonsController : ControllerBase {
    private readonly IPokemonService _svc;
    public PokemonsController(IPokemonService svc) => _svc = svc;

    [HttpGet]         public async Task<IActionResult> List()      => Ok(await _svc.ListAsync());
    [HttpGet("{n}")]  public async Task<IActionResult> Get(string n) => (await _svc.GetAsync(n)) is Pokemon p ? Ok(p) : NotFound();

    [Authorize]
    [HttpPost("seed")]
    public async Task<IActionResult> Seed() {
      await _svc.SeedFromApiAsync();
      return NoContent();
    }
  }
}
EOF

cat > src/Pokedex.API/Controllers/ItemsController.cs << 'EOF'
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pokedex.API.Services;

namespace Pokedex.API.Controllers {
  [ApiController]
  [Route("api/items")]
  public class ItemsController : ControllerBase {
    private readonly IItemService _svc;
    public ItemsController(IItemService svc) => _svc = svc;

    [HttpGet] public async Task<IActionResult> List() => Ok(await _svc.ListAsync());

    [Authorize]
    [HttpPost("seed")]
    public async Task<IActionResult> Seed() {
      await _svc.SeedFromApiAsync();
      return NoContent();
    }
  }
}
EOF

cat > src/Pokedex.API/Controllers/AuthController.cs << 'EOF'
using Microsoft.AspNetCore.Mvc;
using Pokedex.API.Services;

namespace Pokedex.API.Controllers {
  [ApiController]
  [Route("api/auth")]
  public class AuthController : ControllerBase {
    private readonly IAuthService _svc;
    public AuthController(IAuthService svc) => _svc = svc;

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody]Cred c) =>
      Ok(new { token = await _svc.RegisterAsync(c.Username,c.Password) });

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody]Cred c) =>
      Ok(new { token = await _svc.LoginAsync(c.Username,c.Password) });

    public record Cred(string Username,string Password);
  }
}
EOF

# 11) Dockerfile
cat > src/Pokedex.API/Dockerfile << 'EOF'
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY Pokedex.API.csproj ./
RUN dotnet restore
COPY . .
RUN dotnet publish -c Release -o /app
FROM mcr.microsoft.com/dotnet/aspnet:7.0
WORKDIR /app
COPY --from=build /app .
EXPOSE 80
ENTRYPOINT ["dotnet","Pokedex.API.dll"]
EOF

# 12) nuget.config
cat > nuget.config << 'EOF'
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <packageSources>
    <add key="github" value="https://nuget.pkg.github.com/hoangsonww/index.json" />
  </packageSources>
  <packageSourceCredentials>
    <github>
      <add key="Username" value="hoangsonww" />
      <add key="ClearTextPassword" value="\${GH_TOKEN}" />
    </github>
  </packageSourceCredentials>
</configuration>
EOF

echo "✅ Scaffold complete under dotnet/src/Pokedex.API"
echo "• To pack & push without local .NET:"
echo "  cd dotnet && \ "
echo "  export GH_TOKEN=… && \ "
echo "  docker run --rm -e GH_TOKEN -v \"\$PWD\":/ws -w /ws mcr.microsoft.com/dotnet/sdk:7.0 \\"
echo "    sh -c \"dotnet restore src/Pokedex.API/Pokedex.API.csproj && dotnet pack src/Pokedex.API/Pokedex.API.csproj -c Release -o artifacts && dotnet nuget push artifacts/*.nupkg --source https://nuget.pkg.github.com/hoangsonww/index.json --api-key \$GH_TOKEN --skip-duplicate\""
