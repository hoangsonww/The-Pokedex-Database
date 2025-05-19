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
