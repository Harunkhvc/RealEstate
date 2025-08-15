namespace RealEstateApp.Business.DTOs.Property
{
    public class PropertyDetailDto : PropertyListDto
    {
        public string Description { get; set; }
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
