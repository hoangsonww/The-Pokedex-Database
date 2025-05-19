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
