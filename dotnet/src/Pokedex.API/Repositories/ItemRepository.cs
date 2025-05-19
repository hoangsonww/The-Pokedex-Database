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
