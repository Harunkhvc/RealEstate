namespace RealEstateApp.Business.DTOs.Lookups
{
    public class PropertyTypeDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
    }

    public class PropertyTypeCreateDto
    {
        public string Name { get; set; } = null!;
    }

    public class PropertyTypeUpdateDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
    }
}
