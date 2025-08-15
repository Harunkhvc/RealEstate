namespace RealEstateApp.Business.DTOs.Property
{
    public class PropertyCreateDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int CurrencyId { get; set; }
        public int PropertyTypeId { get; set; }
        public int PropertyStatusId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Address { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public List<string>? PhotoUrls { get; set; }
        public int? M2Brut { get; set; }
        public int? M2Net { get; set; }
        public string? RoomCount { get; set; }
        public int? BuildingAge { get; set; }
        public string? Floor { get; set; }
    }
}
