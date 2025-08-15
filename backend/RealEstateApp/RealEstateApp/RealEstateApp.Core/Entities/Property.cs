namespace RealEstateApp.Core.Entities
{
    public class Property
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public decimal Price { get; set; }
        public int CurrencyId { get; set; }
        public Currency Currency { get; set; } = null!;
        public int PropertyTypeId { get; set; }
        public PropertyType PropertyType { get; set; } = null!;
        public int PropertyStatusId { get; set; }
        public PropertyStatus PropertyStatus { get; set; } = null!;
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Address { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public string? ThumbnailUrl { get; set; }
        public ICollection<PropertyPhoto>? Photos { get; set; }
        public int? M2Brut { get; set; }        
        public int? M2Net { get; set; }         
        public string? RoomCount { get; set; }  
        public int? BuildingAge { get; set; }
        public string? Floor { get; set; }

    }
}
