namespace RealEstateApp.Core.Entities
{
    public class PropertyPhoto
    {
        public int Id { get; set; }
        public string PhotoUrl { get; set; } = null!;
        public int PropertyId { get; set; }
        public Property Property { get; set; } = null!;
    }
}
