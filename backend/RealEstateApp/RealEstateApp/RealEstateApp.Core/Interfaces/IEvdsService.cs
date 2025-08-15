namespace RealEstateApp.Business.Interfaces
{
    public interface IEvdsService
    {
        Task<decimal?> GetLiveRateAsync(string code, CancellationToken cancellationToken = default);
    }
}
