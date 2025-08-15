using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RealEstateApp.Core.Entities;
using RealEstateApp.Core.Interfaces;

namespace RealEstateApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PropertyPhotoController : ControllerBase
    {
        private readonly IGenericRepository<PropertyPhoto> _photoRepo;
        private readonly IGenericRepository<Property> _propertyRepo;
        private readonly IWebHostEnvironment _env;

        public PropertyPhotoController(
            IGenericRepository<PropertyPhoto> photoRepo,
            IGenericRepository<Property> propertyRepo,
            IWebHostEnvironment env)
        {
            _photoRepo = photoRepo;
            _propertyRepo = propertyRepo;
            _env = env;
        }

        /// <summary>
        /// Bir property için çoklu fotoğraf yükler ve DB'ye kaydeder.
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpPost("upload/{propertyId}")]
        public async Task<IActionResult> UploadPhotos(int propertyId, [FromForm] List<IFormFile> files)
        {
            var property = await _propertyRepo.GetByIdAsync(propertyId);
            if (property == null)
                return NotFound("İlgili emlak bulunamadı.");

            if (files == null || !files.Any())
                return BadRequest("Dosya seçilmedi.");

            var savedPhotos = new List<string>();

            foreach (var file in files)
            {
                // Sadece jpg/png kabul etmek için basit kontrol:
                var ext = Path.GetExtension(file.FileName).ToLower();
                if (ext != ".jpg" && ext != ".jpeg" && ext != ".png")
                    return BadRequest("Sadece JPG ve PNG dosyaları yüklenebilir.");

                var fileName = $"{Guid.NewGuid()}{ext}";
                var savePath = Path.Combine(_env.WebRootPath, "property-photos", fileName);

                // Dosyayı wwwroot/property-photos/ klasörüne kaydet
                using (var stream = new FileStream(savePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // DB'ye yolunu kaydet (örn: property-photos/xyz.jpg)
                var photo = new PropertyPhoto
                {
                    PropertyId = propertyId,
                    PhotoUrl = $"property-photos/{fileName}"
                };
                await _photoRepo.AddAsync(photo);

                savedPhotos.Add(photo.PhotoUrl);
            }

            return Ok(new { message = "Fotoğraflar başarıyla yüklendi!", photos = savedPhotos });
        }

        /// <summary>
        /// Bir property'nin tüm fotoğraflarını getirir (URL listesi).
        /// </summary>
        [HttpGet("{propertyId}")]
        public async Task<IActionResult> GetPhotos(int propertyId)
        {
            var photos = await _photoRepo.FindAsync(p => p.PropertyId == propertyId);
            var urls = photos.Select(p => "/" + p.PhotoUrl).ToList();
            return Ok(urls);
        }
    }
}
