namespace RealEstateApp.Core.Entities
{
    public class Currency
    {
        public int Id { get; set; }
        public string Code { get; set; } = null!; // (TL, USD, EUR)
        public string Symbol { get; set; } = null!; // ₺, $, €
        public ICollection<Property>? Properties { get; set; }
    }
}
