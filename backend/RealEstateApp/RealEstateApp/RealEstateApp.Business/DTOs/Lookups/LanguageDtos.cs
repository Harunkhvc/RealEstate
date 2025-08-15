namespace RealEstateApp.Business.DTOs.Lookups
{
    public class LanguageDto
    {
        public int Id { get; set; }
        public string Code { get; set; } = null!;
        public string Name { get; set; } = null!;
    }

    public class LanguageCreateDto
    {
        public string Code { get; set; } = null!;
        public string Name { get; set; } = null!;
    }

    public class LanguageUpdateDto
    {
        public int Id { get; set; }
        public string Code { get; set; } = null!;
        public string Name { get; set; } = null!;
    }
}
