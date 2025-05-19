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
