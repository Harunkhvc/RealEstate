namespace RealEstateApp.Business.DTOs.Property
{
    public class PropertyFilterDto
    {
        public int? PropertyTypeId { get; set; }
        public int? PropertyStatusId { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 12;
        public string? AddressContains { get; set; }
        public string? City { get; set; }       // Örn: "İstanbul"
        public string? District { get; set; }   // Örn: "Kadıköy"
        public string? Query { get; set; }
    }
}
