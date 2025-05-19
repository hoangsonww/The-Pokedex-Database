using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Pokedex.API.Models {
  public class Item {
    [BsonId] public ObjectId Id       { get; set; }
    public int      ItemId             { get; set; }
    public string   Name               { get; set; } = null!;
    public string   SpriteUrl          { get; set; } = null!;
  }
}
