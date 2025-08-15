using RealEstateApp.Business.DTOs.Dashboard;
using RealEstateApp.Business.DTOs.Property;

namespace RealEstateApp.Business.Interfaces
{
    public interface IPropertyService
    {
        Task<List<PropertyListDto>> GetAllAsync();
        Task<PropertyDetailDto?> GetByIdAsync(int id);
        Task<int> CreateAsync(PropertyCreateDto dto);
        Task<bool> UpdateAsync(PropertyUpdateDto dto);
        Task<bool> DeleteAsync(int id);
        Task<(List<PropertyListDto> Data, int TotalCount)> FilterAsync(PropertyFilterDto filter);
        Task<DashboardSummaryDto> GetDashboardSummaryAsync();
        Task<List<PropertyListDto>> MapFilterAsync(PropertyMapFilterDto filter);

        // ARAMA
        Task<(List<PropertyListDto> Data, int TotalCount, int Page, int PageSize)>
            SearchAsync(string? type, string? q, int page, int pageSize);
    }
}
