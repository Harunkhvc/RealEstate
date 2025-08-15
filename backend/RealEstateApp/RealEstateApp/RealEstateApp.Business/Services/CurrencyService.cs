using Microsoft.EntityFrameworkCore;
using RealEstateApp.Business.DTOs.Lookups;
using RealEstateApp.Business.Interfaces;
using RealEstateApp.Core.Entities;
using RealEstateApp.Core.Interfaces;

namespace RealEstateApp.Business.Services
{
    public class CurrencyService : ICurrencyService
    {
        private readonly IGenericRepository<Currency> _currencyRepo;
        private readonly IGenericRepository<Property> _propertyRepo;
        private readonly IEvdsService _evdsService;

        public CurrencyService(
            IGenericRepository<Currency> currencyRepo,
            IGenericRepository<Property> propertyRepo,
            IEvdsService evdsService)
        {
            _currencyRepo = currencyRepo;
            _propertyRepo = propertyRepo;
            _evdsService = evdsService;
        }

        public async Task<List<CurrencyDto>> GetAllAsync()
        {
            return await _currencyRepo.Query()
                .OrderBy(x => x.Code)
                .Select(x => new CurrencyDto { Id = x.Id, Code = x.Code, Symbol = x.Symbol })
                .ToListAsync();
        }

        public async Task<int> CreateAsync(CurrencyCreateDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Code))
                throw new ArgumentException("Code boş olamaz.", nameof(dto.Code));
            if (string.IsNullOrWhiteSpace(dto.Symbol))
                throw new ArgumentException("Symbol boş olamaz.", nameof(dto.Symbol));

            var code = dto.Code.Trim().ToUpperInvariant();
            var exists = await _currencyRepo.Query().AnyAsync(c => c.Code == code);
            if (exists)
                throw new InvalidOperationException("Bu para birimi kodu zaten mevcut.");

            var entity = new Currency { Code = code, Symbol = dto.Symbol.Trim() };
            await _currencyRepo.AddAsync(entity);
            await _currencyRepo.SaveAsync();
            return entity.Id;
        }

        public async Task<bool> UpdateAsync(CurrencyUpdateDto dto)
        {
            var entity = await _currencyRepo.GetByIdAsync(dto.Id);
            if (entity == null) return false;

            var code = dto.Code.Trim().ToUpperInvariant();
            var exists = await _currencyRepo.Query()
                .AnyAsync(c => c.Id != dto.Id && c.Code == code);
            if (exists)
                throw new InvalidOperationException("Bu para birimi kodu başka bir kayıtta kullanılıyor.");

            entity.Code = code;
            entity.Symbol = dto.Symbol.Trim();
            _currencyRepo.Update(entity);
            await _currencyRepo.SaveAsync();
            return true;
        }

        public async Task<(bool ok, string? reason)> DeleteAsync(int id)
        {
            var entity = await _currencyRepo.GetByIdAsync(id);
            if (entity == null) return (false, "NotFound");

            var inUse = await _propertyRepo.Query().AnyAsync(p => p.CurrencyId == id);
            if (inUse) return (false, "InUse");

            _currencyRepo.Delete(entity);
            await _currencyRepo.SaveAsync();
            return (true, null);
        }

        public async Task<decimal?> GetLiveRateAsync(string code)
        {
            return await _evdsService.GetLiveRateAsync(code);
        }
    }
}
