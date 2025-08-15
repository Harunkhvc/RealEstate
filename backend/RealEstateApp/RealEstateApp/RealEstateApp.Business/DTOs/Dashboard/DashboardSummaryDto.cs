namespace RealEstateApp.Business.DTOs.Dashboard
{
    public class DashboardSummaryDto
    {
        public int TotalProperties { get; set; }
        public int TotalForSale { get; set; }
        public int TotalForRent { get; set; }
        public List<TypeCountDto> PropertyTypeCounts { get; set; } = new();
        public List<StatusCountDto> PropertyStatusCounts { get; set; } = new();
        public decimal TotalPortfolioValue { get; set; }
    }

    public class TypeCountDto
    {
        public string PropertyType { get; set; } = null!;
        public int Count { get; set; }
    }

    public class StatusCountDto
    {
        public string PropertyStatus { get; set; } = null!;
        public int Count { get; set; }
    }
}
