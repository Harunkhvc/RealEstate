namespace RealEstateApp.Core.Entities
{
    public class PropertyType
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!; // (Daire, Villa, Arsa)
        public ICollection<Property>? Properties { get; set; }
    }
}
