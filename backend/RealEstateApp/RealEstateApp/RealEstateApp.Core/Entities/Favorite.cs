// Core/Entities/Favorite.cs
using RealEstateApp.Core.Entities;

public class Favorite
{
    public int Id { get; set; }
    public int PropertyId { get; set; }
    public int UserId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Property Property { get; set; } = null!;
    public User User { get; set; } = null!;
}
