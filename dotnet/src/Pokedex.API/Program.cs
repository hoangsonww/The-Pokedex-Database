using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using Pokedex.API.Data;
using Pokedex.API.Models;
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
