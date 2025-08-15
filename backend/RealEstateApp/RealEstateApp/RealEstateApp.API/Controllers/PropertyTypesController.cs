using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RealEstateApp.Business.DTOs.Lookups;
using RealEstateApp.Business.Interfaces;

namespace RealEstateApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PropertyTypesController : ControllerBase
    {
        private readonly IPropertyTypeService _service;

        public PropertyTypesController(IPropertyTypeService service)
        {
            _service = service;
        }

        /// <summary> Tüm emlak tiplerini listeler. </summary>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _service.GetAllAsync();
            return Ok(list);
        }

        /// <summary> Yeni emlak tipi oluşturur. </summary>
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] PropertyTypeCreateDto dto)
        {
            try
            {
                var id = await _service.CreateAsync(dto);
                return CreatedAtAction(nameof(GetAll), new { id }, new { id });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary> Emlak tipi günceller. </summary>
        [Authorize(Roles = "Admin")]
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] PropertyTypeUpdateDto dto)
        {
            if (id != dto.Id) return BadRequest(new { message = "Route id ile body id eşleşmeli." });

            try
            {
                var ok = await _service.UpdateAsync(dto);
                if (!ok) return NotFound();
                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }

        /// <summary> Emlak tipini siler. (Kullanımda ise 409) </summary>
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var (ok, reason) = await _service.DeleteAsync(id);
            if (ok) return NoContent();

            if (reason == "NotFound") return NotFound();
            if (reason == "InUse") return Conflict(new { message = "Bu emlak tipi kullanılıyor, silinemez." });

            return BadRequest();
        }
    }
}
