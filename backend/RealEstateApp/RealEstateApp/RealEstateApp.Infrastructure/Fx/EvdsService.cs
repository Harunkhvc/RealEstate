using Microsoft.Extensions.Options;
using System.Globalization;
using System.Net.Http;
using System.Text.Json;
using RealEstateApp.Business.Interfaces;

namespace RealEstateApp.Infrastructure.Fx
{
    public class EvdsService : IEvdsService
    {
        private readonly HttpClient _httpClient;
        private readonly EvdsOptions _options;

        public EvdsService(HttpClient httpClient, IOptions<EvdsOptions> options)
        {
            _httpClient = httpClient;
            _options = options.Value;
        }

        public async Task<decimal?> GetLiveRateAsync(string currencyCode, CancellationToken cancellationToken = default)
        {
            string seriesCode = currencyCode.ToUpper() switch
            {
                "USD" => "TP.DK.USD.S.YTL",
                "EUR" => "TP.DK.EUR.S.YTL",
                _ => throw new ArgumentException("Desteklenmeyen döviz kodu.")
            };

            string today = DateTime.UtcNow.ToString("dd-MM-yyyy", CultureInfo.InvariantCulture);
            string url = $"https://evds2.tcmb.gov.tr/service/evds/series={seriesCode}&startDate={today}&endDate={today}&type=json&key={_options.ApiKey}";

            var response = await _httpClient.GetAsync(url, cancellationToken);
            if (!response.IsSuccessStatusCode)
                return null;

            var content = await response.Content.ReadAsStringAsync(cancellationToken);
            using var doc = JsonDocument.Parse(content);

            if (doc.RootElement.TryGetProperty("items", out var items) && items.GetArrayLength() > 0)
            {
                var valStr = items[0].GetProperty(seriesCode).GetString();
                if (decimal.TryParse(valStr, NumberStyles.Any, CultureInfo.InvariantCulture, out var rate))
                    return rate;
            }

            return null;
        }
    }
}
