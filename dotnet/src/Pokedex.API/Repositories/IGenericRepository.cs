using MongoDB.Bson;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Pokedex.API.Repositories {
  public interface IGenericRepository<T> {
    Task<List<T>> GetAllAsync();
    Task<T?>      GetByIdAsync(ObjectId id);
    Task          AddAsync(T e);
    Task          UpdateAsync(ObjectId id, T e);
    Task          DeleteAsync(ObjectId id);
  }
}
