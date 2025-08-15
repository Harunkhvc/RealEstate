// API/Controllers/FavoritesController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class FavoritesController : ControllerBase
{
    private readonly IFavoriteService _svc;
    public FavoritesController(IFavoriteService svc) => _svc = svc;

    int CurrentUserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost("{propertyId:int}/toggle")]
    public async Task<IActionResult> Toggle(int propertyId)
    {
        var added = await _svc.ToggleAsync(CurrentUserId, propertyId);
        return Ok(new { added });
    }

    [HttpGet("ids")]
    public async Task<IActionResult> GetIds()
        => Ok(await _svc.GetIdsAsync(CurrentUserId));

    [HttpGet]
    public async Task<IActionResult> GetList()
        => Ok(await _svc.GetPropertiesAsync(CurrentUserId));

    [HttpDelete("{propertyId:int}")]
    public async Task<IActionResult> Remove(int propertyId)
    {
        var added = await _svc.ToggleAsync(CurrentUserId, propertyId); // toggle geri silecek
        if (added) return BadRequest("Kayıt yoktu, eklendi.");
        return NoContent();
    }
}
