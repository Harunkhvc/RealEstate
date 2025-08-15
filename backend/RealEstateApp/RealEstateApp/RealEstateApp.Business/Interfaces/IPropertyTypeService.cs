using RealEstateApp.Business.DTOs.Lookups;

namespace RealEstateApp.Business.Interfaces
{
    public interface IPropertyTypeService
    {
        Task<List<PropertyTypeDto>> GetAllAsync();
        Task<int> CreateAsync(PropertyTypeCreateDto dto);
        Task<bool> UpdateAsync(PropertyTypeUpdateDto dto);
        Task<(bool ok, string? reason)> DeleteAsync(int id);
    }
}
