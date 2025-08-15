namespace RealEstateApp.Core.Entities
{
    public class Language
    {
        public int Id { get; set; }
        public string Code { get; set; } = null!; // tr, en
        public string Name { get; set; } = null!; // Türkçe, English
    }
}
