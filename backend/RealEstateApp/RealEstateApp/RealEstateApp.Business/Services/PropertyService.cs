using System.Linq;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using RealEstateApp.Business.DTOs.Dashboard;
using RealEstateApp.Business.DTOs.Property;
using RealEstateApp.Business.Interfaces;
using RealEstateApp.Core.Entities;
using RealEstateApp.Core.Interfaces;

namespace RealEstateApp.Business.Services
{
    public class PropertyService : IPropertyService
    {
        private readonly IGenericRepository<Property> _propertyRepo;
        private readonly IGenericRepository<PropertyPhoto> _photoRepo;
        private readonly IMapper _mapper;

        private const string TrCollation = "Turkish_CI_AS"; // SQL Server için TR duyarlı arama

        public PropertyService(
            IGenericRepository<Property> propertyRepo,
            IGenericRepository<PropertyPhoto> photoRepo,
            IMapper mapper)
        {
            _propertyRepo = propertyRepo;
            _photoRepo = photoRepo;
            _mapper = mapper;
        }

        public async Task<List<PropertyListDto>> GetAllAsync()
        {
            var list = await _propertyRepo.Query()
                .AsNoTracking()
                .Include(p => p.PropertyType)
                .Include(p => p.PropertyStatus)
                .Include(p => p.Currency)
                .ToListAsync();

            return _mapper.Map<List<PropertyListDto>>(list);
        }

        public async Task<PropertyDetailDto?> GetByIdAsync(int id)
        {
            var property = await _propertyRepo.Query()
                .AsNoTracking()
                .Include(p => p.PropertyType)
                .Include(p => p.PropertyStatus)
                .Include(p => p.Currency)
                .Include(p => p.Photos)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (property == null) return null;
            return _mapper.Map<PropertyDetailDto>(property);
        }

        public async Task<int> CreateAsync(PropertyCreateDto dto)
        {
            var property = _mapper.Map<Property>(dto);
            await _propertyRepo.AddAsync(property);

            if (dto.PhotoUrls != null && dto.PhotoUrls.Any())
            {
                foreach (var url in dto.PhotoUrls)
                {
                    var photo = new PropertyPhoto { PhotoUrl = url, Property = property };
                    await _photoRepo.AddAsync(photo);
                }
            }

            await _propertyRepo.SaveAsync();
            return property.Id;
        }

        public async Task<bool> UpdateAsync(PropertyUpdateDto dto)
        {
            var property = await _propertyRepo.GetByIdAsync(dto.Id);
            if (property == null) return false;

            _mapper.Map(dto, property);
            _propertyRepo.Update(property);

            await _propertyRepo.SaveAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var property = await _propertyRepo.GetByIdAsync(id);
            if (property == null) return false;

            _propertyRepo.Delete(property);
            await _propertyRepo.SaveAsync();
            return true;
        }

        public async Task<(List<PropertyListDto> Data, int TotalCount)> FilterAsync(PropertyFilterDto filter)
        {
            filter.Page = filter.Page <= 0 ? 1 : filter.Page;
            filter.PageSize = filter.PageSize is <= 0 or > 100 ? 12 : filter.PageSize;

            var query = _propertyRepo.Query()
                .AsNoTracking()
                .Include(p => p.PropertyType)
                .Include(p => p.PropertyStatus)
                .Include(p => p.Currency)
                .AsQueryable();

            // Temel filtreler
            if (filter.PropertyTypeId.HasValue)
                query = query.Where(x => x.PropertyTypeId == filter.PropertyTypeId.Value);

            if (filter.PropertyStatusId.HasValue)
                query = query.Where(x => x.PropertyStatusId == filter.PropertyStatusId.Value);

            if (filter.MinPrice.HasValue)
                query = query.Where(x => x.Price >= filter.MinPrice.Value);

            if (filter.MaxPrice.HasValue)
                query = query.Where(x => x.Price <= filter.MaxPrice.Value);

            if (filter.StartDate.HasValue)
                query = query.Where(x => x.StartDate >= filter.StartDate.Value);

            if (filter.EndDate.HasValue)
                query = query.Where(x => x.EndDate <= filter.EndDate.Value);

            // City/District filtreleme (Address üzerinden)
            if (!string.IsNullOrWhiteSpace(filter.City))
            {
                var city = filter.City.Trim();
                query = query.Where(p =>
                    p.Address != null &&
                    EF.Functions.Like(EF.Functions.Collate(p.Address!, TrCollation), $"%{city}%"));
            }

            if (!string.IsNullOrWhiteSpace(filter.District))
            {
                var district = filter.District.Trim();
                query = query.Where(p =>
                    p.Address != null &&
                    EF.Functions.Like(EF.Functions.Collate(p.Address!, TrCollation), $"%{district}%"));
            }

            // Genel metin araması (Title + Description)
            if (!string.IsNullOrWhiteSpace(filter.Query))
            {
                var term = filter.Query.Trim();
                query = query.Where(p =>
                    EF.Functions.Like(EF.Functions.Collate(p.Title, TrCollation), $"%{term}%") ||
                    EF.Functions.Like(EF.Functions.Collate(p.Description, TrCollation), $"%{term}%"));
            }

            var total = await query.CountAsync();

            var data = await query
                .OrderByDescending(x => x.StartDate)
                .Skip((filter.Page - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .Select(p => new PropertyListDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    PropertyType = p.PropertyType.Name,
                    PropertyStatus = p.PropertyStatus.Name,
                    Price = p.Price,
                    Currency = p.Currency.Code,
                    ThumbnailUrl = p.ThumbnailUrl ?? "",
                    StartDate = p.StartDate,
                    EndDate = p.EndDate
                })
                .ToListAsync();

            return (data, total);
        }

        public async Task<DashboardSummaryDto> GetDashboardSummaryAsync()
        {
            var query = _propertyRepo.Query().AsNoTracking();

            var total = await query.CountAsync();

            var totalForSale = await query
                .Include(x => x.PropertyStatus)
                .CountAsync(x => x.PropertyStatus.Name == "Satılık");

            var totalForRent = await query
                .Include(x => x.PropertyStatus)
                .CountAsync(x => x.PropertyStatus.Name == "Kiralık");

            var typeCounts = await _propertyRepo.Query()
                .AsNoTracking()
                .Include(x => x.PropertyType)
                .GroupBy(x => x.PropertyType.Name)
                .Select(g => new TypeCountDto { PropertyType = g.Key, Count = g.Count() })
                .ToListAsync();

            var statusCounts = await _propertyRepo.Query()
                .AsNoTracking()
                .Include(x => x.PropertyStatus)
                .GroupBy(x => x.PropertyStatus.Name)
                .Select(g => new StatusCountDto { PropertyStatus = g.Key, Count = g.Count() })
                .ToListAsync();

            var totalValue = await query.SumAsync(x => x.Price);

            return new DashboardSummaryDto
            {
                TotalProperties = total,
                TotalForSale = totalForSale,
                TotalForRent = totalForRent,
                PropertyTypeCounts = typeCounts,
                PropertyStatusCounts = statusCounts,
                TotalPortfolioValue = totalValue
            };
        }

        public async Task<List<PropertyListDto>> MapFilterAsync(PropertyMapFilterDto filter)
        {
            var query = _propertyRepo.Query()
                .AsNoTracking()
                .Where(p => p.Latitude.HasValue && p.Longitude.HasValue);

            if (filter.PropertyTypeId.HasValue)
                query = query.Where(x => x.PropertyTypeId == filter.PropertyTypeId.Value);

            if (filter.PropertyStatusId.HasValue)
                query = query.Where(x => x.PropertyStatusId == filter.PropertyStatusId.Value);

            if (filter.MinPrice.HasValue)
                query = query.Where(x => x.Price >= filter.MinPrice.Value);

            if (filter.MaxPrice.HasValue)
                query = query.Where(x => x.Price <= filter.MaxPrice.Value);

            var data = await query
                .Select(p => new PropertyListDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    PropertyType = p.PropertyType.Name,
                    PropertyStatus = p.PropertyStatus.Name,
                    Price = p.Price,
                    Currency = p.Currency.Code,
                    ThumbnailUrl = p.ThumbnailUrl ?? "",
                    StartDate = p.StartDate,
                    EndDate = p.EndDate
                })
                .ToListAsync();

            return data;
        }

        public async Task<(List<PropertyListDto> Data, int TotalCount, int Page, int PageSize)>
            SearchAsync(string? type, string? q, int page, int pageSize)
        {
            page = page <= 0 ? 1 : page;
            pageSize = pageSize is <= 0 or > 100 ? 20 : pageSize;

            IQueryable<Property> query = _propertyRepo.Query().AsNoTracking();

            if (!string.IsNullOrWhiteSpace(type))
            {
                var t = type.Trim();
                query = query.Where(p => EF.Functions.Collate(p.PropertyType.Name, TrCollation) == t);
            }

            if (!string.IsNullOrWhiteSpace(q))
            {
                var term = q.Trim();
                query = query.Where(p =>
                    EF.Functions.Like(EF.Functions.Collate(p.Title, TrCollation), $"%{term}%") ||
                    EF.Functions.Like(EF.Functions.Collate(p.Description, TrCollation), $"%{term}%"));
            }

            var total = await query.CountAsync();

            var items = await query
                .OrderByDescending(p => p.StartDate)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new PropertyListDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    PropertyType = p.PropertyType.Name,
                    PropertyStatus = p.PropertyStatus.Name,
                    Price = p.Price,
                    Currency = p.Currency.Code,
                    ThumbnailUrl = p.ThumbnailUrl ?? "",
                    StartDate = p.StartDate,
                    EndDate = p.EndDate
                })
                .ToListAsync();

            return (items, total, page, pageSize);
        }
    }
}
