using Microsoft.EntityFrameworkCore;
using RealEstateApp.Business.DTOs.Lookups;
using RealEstateApp.Business.Interfaces;
using RealEstateApp.Core.Entities;
using RealEstateApp.Core.Interfaces;

namespace RealEstateApp.Business.Services
{
    public class LanguageService : ILanguageService
    {
        private readonly IGenericRepository<Language> _langRepo;

        public LanguageService(IGenericRepository<Language> langRepo)
        {
            _langRepo = langRepo;
        }

        public async Task<List<LanguageDto>> GetAllAsync()
        {
            return await _langRepo.Query()
                .OrderBy(x => x.Code)
                .Select(x => new LanguageDto { Id = x.Id, Code = x.Code, Name = x.Name })
                .ToListAsync();
        }

        public async Task<int> CreateAsync(LanguageCreateDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Code))
                throw new ArgumentException("Code boş olamaz.", nameof(dto.Code));
            if (string.IsNullOrWhiteSpace(dto.Name))
                throw new ArgumentException("Name boş olamaz.", nameof(dto.Name));

            var code = dto.Code.Trim().ToLowerInvariant();
            var exists = await _langRepo.Query().AnyAsync(l => l.Code == code);
            if (exists)
                throw new InvalidOperationException("Bu dil kodu zaten mevcut.");

            var entity = new Language { Code = code, Name = dto.Name.Trim() };
            await _langRepo.AddAsync(entity);
            await _langRepo.SaveAsync();
            return entity.Id;
        }

        public async Task<bool> UpdateAsync(LanguageUpdateDto dto)
        {
            var entity = await _langRepo.GetByIdAsync(dto.Id);
            if (entity == null) return false;

            var code = dto.Code.Trim().ToLowerInvariant();
            var exists = await _langRepo.Query().AnyAsync(l => l.Id != dto.Id && l.Code == code);
            if (exists)
                throw new InvalidOperationException("Bu dil kodu başka bir kayıtta kullanılıyor.");

            entity.Code = code;
            entity.Name = dto.Name.Trim();
            _langRepo.Update(entity);
            await _langRepo.SaveAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _langRepo.GetByIdAsync(id);
            if (entity == null) return false;

            _langRepo.Delete(entity);
            await _langRepo.SaveAsync();
            return true;
        }
    }
}
