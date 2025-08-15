namespace RealEstateApp.Business.DTOs.Property
{
    public class PropertyListDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string PropertyType { get; set; }
        public string PropertyStatus { get; set; }
        public decimal Price { get; set; }
        public string Currency { get; set; }
        public string ThumbnailUrl { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string City { get; set; } = "";
        public string District { get; set; } = "";
    }
}


