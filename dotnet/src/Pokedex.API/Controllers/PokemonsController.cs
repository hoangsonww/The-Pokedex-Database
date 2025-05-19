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
