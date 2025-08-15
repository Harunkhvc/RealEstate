namespace RealEstateApp.Business.DTOs.Lookups
{
    public class CurrencyDto
    {
        public int Id { get; set; }
        public string Code { get; set; } = null!;   // TL, USD, EUR
        public string Symbol { get; set; } = null!; // ₺, $, €
    }

    public class CurrencyCreateDto
    {
        public string Code { get; set; } = null!;
        public string Symbol { get; set; } = null!;
    }

    public class CurrencyUpdateDto
    {
        public int Id { get; set; }
        public string Code { get; set; } = null!;
        public string Symbol { get; set; } = null!;
    }
}
