using RealEstateApp.Business.DTOs.Lookups;

namespace RealEstateApp.Business.Interfaces
{
    public interface ICurrencyService
    {
        Task<List<CurrencyDto>> GetAllAsync();
        Task<int> CreateAsync(CurrencyCreateDto dto);
        Task<bool> UpdateAsync(CurrencyUpdateDto dto);
        Task<(bool ok, string? reason)> DeleteAsync(int id);

        /// <summary>
        /// TCMB EVDS üzerinden canlı döviz kuru çeker.
        /// </summary>
        Task<decimal?> GetLiveRateAsync(string code);
    }
}
