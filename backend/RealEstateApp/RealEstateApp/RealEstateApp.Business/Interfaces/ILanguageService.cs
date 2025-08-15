using RealEstateApp.Business.DTOs.Lookups;

namespace RealEstateApp.Business.Interfaces
{
    public interface ILanguageService
    {
        Task<List<LanguageDto>> GetAllAsync();
        Task<int> CreateAsync(LanguageCreateDto dto);
        Task<bool> UpdateAsync(LanguageUpdateDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
