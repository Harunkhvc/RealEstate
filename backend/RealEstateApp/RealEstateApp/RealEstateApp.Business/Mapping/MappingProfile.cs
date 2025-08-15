// Business/Mapping/MappingProfile.cs
using AutoMapper;
using RealEstateApp.Core.Entities;
using RealEstateApp.Business.DTOs.Property;
using System.Linq;
using System.Collections.Generic;

namespace RealEstateApp.Business.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Entity -> List DTO
            CreateMap<Property, PropertyListDto>()
                .ForMember(dest => dest.PropertyType, opt => opt.MapFrom(src => src.PropertyType.Name))
                .ForMember(dest => dest.PropertyStatus, opt => opt.MapFrom(src => src.PropertyStatus.Name))
                .ForMember(dest => dest.Currency, opt => opt.MapFrom(src => src.Currency.Code))
                .ForMember(dest => dest.ThumbnailUrl, opt => opt.MapFrom(src =>
                    // 1) ThumbnailUrl doluysa onu kullan
                    !string.IsNullOrWhiteSpace(src.ThumbnailUrl)
                        ? src.ThumbnailUrl
                        // 2) değilse ilk fotoğrafın url'i
                        : (src.Photos != null && src.Photos.Any()
                            ? src.Photos
                                .OrderBy(p => p.Id)             // istersen SortOrder alanın varsa ona göre sırala
                                .Select(p => p.PhotoUrl)        // PropertyPhoto’daki alan adın PhotoUrl ise
                                .FirstOrDefault()
                            : string.Empty)
                ));

            // Entity -> Detail DTO
            CreateMap<Property, PropertyDetailDto>()
                .IncludeBase<Property, PropertyListDto>()
                .ForMember(dest => dest.PhotoUrls, opt => opt.MapFrom(src =>
                    src.Photos != null
                        ? src.Photos
                            .OrderBy(p => p.Id)
                            .Select(p => p.PhotoUrl)
                            .ToList()
                        : new List<string>()))
                .ForMember(dest => dest.M2Brut, opt => opt.MapFrom(src => src.M2Brut))
                .ForMember(dest => dest.M2Net, opt => opt.MapFrom(src => src.M2Net))
                .ForMember(dest => dest.RoomCount, opt => opt.MapFrom(src => src.RoomCount))
                .ForMember(dest => dest.BuildingAge, opt => opt.MapFrom(src => src.BuildingAge))
                .ForMember(dest => dest.Floor, opt => opt.MapFrom(src => src.Floor));

            // Create DTO -> Entity
            CreateMap<PropertyCreateDto, Property>()
                .ForMember(dest => dest.Photos, opt => opt.Ignore())
                .ForMember(dest => dest.ThumbnailUrl, opt => opt.MapFrom(src =>
                    (src.PhotoUrls != null && src.PhotoUrls.Any()) ? src.PhotoUrls.First() : null));

            // Update DTO -> Entity
            CreateMap<PropertyUpdateDto, Property>()
                .ForMember(dest => dest.Photos, opt => opt.Ignore())
                .ForMember(dest => dest.ThumbnailUrl, opt =>
                {
                    // DTO'da ThumbnailUrl null değilse güncelle, null ise mevcut değeri koru
                    opt.Condition((src, dest, val) => val != null);
                });
        }
    }
}
