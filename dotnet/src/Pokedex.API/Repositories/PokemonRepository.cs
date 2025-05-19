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
