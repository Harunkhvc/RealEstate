using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RealEstateApp.Business.DTOs.Lookups;
using RealEstateApp.Business.Interfaces;

namespace RealEstateApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CurrenciesController : ControllerBase
    {
        private readonly ICurrencyService _currencyService;

        public CurrenciesController(ICurrencyService currencyService)
        {
            _currencyService = currencyService;
        }

        // 📌 Veritabanındaki tüm para birimlerini listele
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _currencyService.GetAllAsync();
            return Ok(list);
        }

        // 📌 Canlı döviz kuru (USD ve EUR)
        [HttpGet("live/{code}")]
        public async Task<IActionResult> GetLiveRate(string code)
        {
            try
            {
                var rate = await _currencyService.GetLiveRateAsync(code.ToUpper());
                if (rate == null)
                    return NotFound(new { message = $"Kur bulunamadı: {code}" });

                return Ok(new
                {
                    Currency = code.ToUpper(),
                    Rate = rate
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // 📌 Yeni para birimi ekle
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CurrencyCreateDto dto)
        {
            var id = await _currencyService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetAll), new { id }, new { id });
        }

        // 📌 Para birimi güncelle
        [Authorize(Roles = "Admin")]
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] CurrencyUpdateDto dto)
        {
            if (id != dto.Id)
                return BadRequest(new { message = "Route id ile body id eşleşmeli." });

            var ok = await _currencyService.UpdateAsync(dto);
            if (!ok) return NotFound();
            return NoContent();
        }

        // 📌 Para birimi sil
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var (ok, reason) = await _currencyService.DeleteAsync(id);
            if (ok) return NoContent();
            if (reason == "NotFound") return NotFound();
            if (reason == "InUse") return Conflict(new { message = "Bu para birimi kullanılıyor, silinemez." });
            return BadRequest();
        }
    }
}
