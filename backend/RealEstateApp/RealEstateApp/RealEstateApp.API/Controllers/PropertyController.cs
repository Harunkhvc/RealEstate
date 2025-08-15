using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RealEstateApp.Business.DTOs.Property;
using RealEstateApp.Business.Interfaces;

namespace RealEstateApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PropertyController : ControllerBase
    {
        private readonly IPropertyService _service;
        public PropertyController(IPropertyService service)
        {
            _service = service;
        }

        /// <summary>
        /// Tüm emlakları listeler.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _service.GetAllAsync();
            return Ok(result);
        }

        /// <summary>
        /// Id’ye göre emlak detayını getirir.
        /// </summary>
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var result = await _service.GetByIdAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        /// <summary>
        /// Yeni emlak kaydı oluşturur.
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] PropertyCreateDto dto)
        {
            var id = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id }, new { id });
        }

        /// <summary>
        /// Emlak kaydını günceller. (UI: PUT /api/property/{id})
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] PropertyUpdateDto dto)
        {
            if (dto == null || id != dto.Id)
                return BadRequest("Route id ile body id aynı olmalıdır.");

            var ok = await _service.UpdateAsync(dto);
            if (!ok) return NotFound();
            return NoContent();
        }

        /// <summary>
        /// Emlak kaydını siler.
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            var ok = await _service.DeleteAsync(id);
            if (!ok) return NotFound();
            return NoContent();
        }

        /// <summary>
        /// Filtreli ve sayfalı emlak listesi döner.
        /// </summary>
        [HttpPost("filter")]
        public async Task<IActionResult> Filter([FromBody] PropertyFilterDto filter)
        {
            var (data, total) = await _service.FilterAsync(filter);
            return Ok(new
            {
                totalCount = total,
                page = filter.Page,
                pageSize = filter.PageSize,
                data
            });
        }

        [HttpGet("dashboard-summary")]
        public async Task<IActionResult> DashboardSummary()
        {
            var summary = await _service.GetDashboardSummaryAsync();
            return Ok(summary);
        }

        [HttpPost("map-filter")]
        public async Task<IActionResult> MapFilter([FromBody] PropertyMapFilterDto filter)
        {
            var data = await _service.MapFilterAsync(filter);
            return Ok(data);
        }

        /// <summary>
        /// Basit arama (tip + serbest metin) ve sayfalama.
        /// </summary>
        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string? city, [FromQuery] string? district,
                                         [FromQuery] string? q, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var (data, total) = await _service.FilterAsync(new PropertyFilterDto
            {
                City = city,
                District = district,
                Query = q,
                Page = page,
                PageSize = pageSize
            });
            return Ok(new { totalCount = total, page, pageSize, data });
        }
    }
}
