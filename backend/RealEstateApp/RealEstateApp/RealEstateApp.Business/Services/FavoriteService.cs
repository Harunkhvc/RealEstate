// Business/Services/FavoriteService.cs
using AutoMapper;
using RealEstateApp.Business.DTOs.Property;
using RealEstateApp.Core.Interfaces;
using RealEstateApp.Business.Interfaces;


public class FavoriteService : IFavoriteService
{
    private readonly IFavoriteRepository _repo;
    private readonly IMapper _mapper;
    private readonly IPropertyService _propertyService;

    public FavoriteService(IFavoriteRepository repo, IMapper mapper, IPropertyService propertyService)
    {
        _repo = repo; _mapper = mapper; _propertyService = propertyService;
    }

    public async Task<bool> ToggleAsync(int userId, int propertyId)
    {
        if (await _repo.ExistsAsync(userId, propertyId))
        {
            await _repo.RemoveAsync(userId, propertyId);
            return false;
        }
        await _repo.AddAsync(new Favorite { UserId = userId, PropertyId = propertyId });
        return true;
    }

    public Task<List<int>> GetIdsAsync(int userId) => _repo.GetUserFavoritePropertyIdsAsync(userId);

    public async Task<List<PropertyListDto>> GetPropertiesAsync(int userId)
    {
        var props = await _repo.GetUserFavoritePropertiesAsync(userId);
        return _mapper.Map<List<PropertyListDto>>(props);
    }
}
