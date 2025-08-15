using Microsoft.EntityFrameworkCore;
using RealEstateApp.Business.DTOs.Lookups;
using RealEstateApp.Business.Interfaces;
using RealEstateApp.Core.Entities;
using RealEstateApp.Core.Interfaces;

namespace RealEstateApp.Business.Services
{
    public class PropertyTypeService : IPropertyTypeService
    {
        private readonly IGenericRepository<PropertyType> _typeRepo;
        private readonly IGenericRepository<Property> _propertyRepo;

        // SQL Server Türkçe karşılaştırma istersen:
        private const string TrCollation = "Turkish_CI_AS";

        public PropertyTypeService(
            IGenericRepository<PropertyType> typeRepo,
            IGenericRepository<Property> propertyRepo)
        {
            _typeRepo = typeRepo;
            _propertyRepo = propertyRepo;
        }

        public async Task<List<PropertyTypeDto>> GetAllAsync()
        {
            var items = await _typeRepo.Query()
                .OrderBy(x => x.Name)
                .Select(x => new PropertyTypeDto { Id = x.Id, Name = x.Name })
                .ToListAsync();

            return items;
        }

        public async Task<int> CreateAsync(PropertyTypeCreateDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
                throw new ArgumentException("Name boş olamaz.", nameof(dto.Name));

            var name = dto.Name.Trim();

            // Uniq kontrol (Türkçe büyük/küçük duyarlı)
            var exists = await _typeRepo.Query()
                .AnyAsync(x => EF.Functions.Collate(x.Name, TrCollation) == name);

            if (exists)
                throw new InvalidOperationException("Bu isimde bir emlak tipi zaten var.");

            var entity = new PropertyType { Name = name };
            await _typeRepo.AddAsync(entity);
            await _typeRepo.SaveAsync();
            return entity.Id;
        }

        public async Task<bool> UpdateAsync(PropertyTypeUpdateDto dto)
        {
            var entity = await _typeRepo.GetByIdAsync(dto.Id);
            if (entity == null) return false;

            var name = dto.Name.Trim();
            var exists = await _typeRepo.Query()
                .AnyAsync(x => x.Id != dto.Id && EF.Functions.Collate(x.Name, TrCollation) == name);
            if (exists)
                throw new InvalidOperationException("Bu isimde başka bir emlak tipi zaten var.");

            entity.Name = name;
            _typeRepo.Update(entity);
            await _typeRepo.SaveAsync();
            return true;
        }

        public async Task<(bool ok, string? reason)> DeleteAsync(int id)
        {
            var entity = await _typeRepo.GetByIdAsync(id);
            if (entity == null) return (false, "NotFound");

            // Bağımlılık kontrolü: Üzerinde property var mı?
            var inUse = await _propertyRepo.Query().AnyAsync(p => p.PropertyTypeId == id);
            if (inUse) return (false, "InUse");

            _typeRepo.Delete(entity);
            await _typeRepo.SaveAsync();
            return (true, null);
        }
    }
}
