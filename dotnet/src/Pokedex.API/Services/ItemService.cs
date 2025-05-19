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
