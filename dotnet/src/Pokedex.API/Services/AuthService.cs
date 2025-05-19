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
