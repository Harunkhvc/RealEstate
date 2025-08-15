namespace RealEstateApp.Business.DTOs.Property
{
    public class PropertyMapFilterDto
    {
        public int? PropertyTypeId { get; set; }
        public int? PropertyStatusId { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }

        // Harita için arama alanı
        public double? CenterLatitude { get; set; }
        public double? CenterLongitude { get; set; }
        public double? RadiusKm { get; set; } // Örn: 5 km çapında property’ler
    }
}
