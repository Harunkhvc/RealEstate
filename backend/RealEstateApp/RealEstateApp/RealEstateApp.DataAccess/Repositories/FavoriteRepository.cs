// DataAccess/Repositories/FavoriteRepository.cs
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using RealEstateApp.Core.Entities;
using RealEstateApp.Core.Interfaces;
using RealEstateApp.DataAccess.Context;

namespace RealEstateApp.DataAccess.Repositories
{
    public class FavoriteRepository : IFavoriteRepository
    {
        private readonly RealEstateDbContext _ctx;
        public FavoriteRepository(RealEstateDbContext ctx) => _ctx = ctx;

        public Task<bool> ExistsAsync(int userId, int propertyId) =>
            _ctx.Set<Favorite>().AnyAsync(x => x.UserId == userId && x.PropertyId == propertyId);

        public async Task AddAsync(Favorite fav)
        {
            await _ctx.Set<Favorite>().AddAsync(fav);
            await _ctx.SaveChangesAsync();
        }

        public async Task RemoveAsync(int userId, int propertyId)
        {
            var fav = await _ctx.Set<Favorite>()
                .FirstOrDefaultAsync(x => x.UserId == userId && x.PropertyId == propertyId);
            if (fav is null) return;

            _ctx.Remove(fav);
            await _ctx.SaveChangesAsync();
        }

        // FOTOĞRAFLARLA BİRLİKTE ÇEK (resimlerin gelmesi için)
        public async Task<List<Property>> GetUserFavoritePropertiesAsync(int userId)
        {
            // Önce favori property id'lerini al
            var propIds = await _ctx.Set<Favorite>()
                .Where(f => f.UserId == userId)
                .Select(f => f.PropertyId)
                .ToListAsync();

            if (propIds.Count == 0)
                return new List<Property>();

            // Sonra Property tablosundan Photos ile birlikte yükle
            return await _ctx.Set<Property>()
    .Where(p => propIds.Contains(p.Id))
    .Include(p => p.Photos)
    .Include(p => p.PropertyType)
    .Include(p => p.PropertyStatus)
    .Include(p => p.Currency)
    .AsNoTracking()
    .ToListAsync();
        }

        public Task<List<int>> GetUserFavoritePropertyIdsAsync(int userId) =>
            _ctx.Set<Favorite>()
                .Where(x => x.UserId == userId)
                .Select(x => x.PropertyId)
                .ToListAsync();
    }
}
