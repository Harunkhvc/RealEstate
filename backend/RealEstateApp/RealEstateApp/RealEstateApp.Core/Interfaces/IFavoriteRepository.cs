// Core/Interfaces/IFavoriteRepository.cs
using System.Collections.Generic;
using System.Threading.Tasks;
using RealEstateApp.Core.Entities;

namespace RealEstateApp.Core.Interfaces
{
    public interface IFavoriteRepository
    {
        Task<bool> ExistsAsync(int userId, int propertyId);
        Task AddAsync(Favorite fav);
        Task RemoveAsync(int userId, int propertyId);
        Task<List<Property>> GetUserFavoritePropertiesAsync(int userId);
        Task<List<int>> GetUserFavoritePropertyIdsAsync(int userId);
    }
}
