namespace RealEstateApp.Core.Entities
{
    public class PropertyStatus
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!; // (Kiralık, Satılık)
        public ICollection<Property>? Properties { get; set; }
    }
}
