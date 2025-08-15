// Business/Interfaces/IFavoriteService.cs
using RealEstateApp.Business.DTOs.Property;

public interface IFavoriteService
{
    Task<bool> ToggleAsync(int userId, int propertyId); // true=ekledi, false=sildi
    Task<List<int>> GetIdsAsync(int userId);
    Task<List<PropertyListDto>> GetPropertiesAsync(int userId);
}