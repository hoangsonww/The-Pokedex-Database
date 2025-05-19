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
