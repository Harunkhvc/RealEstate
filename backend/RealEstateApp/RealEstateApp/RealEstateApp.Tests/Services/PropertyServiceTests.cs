using AutoMapper;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Moq;
using RealEstateApp.Business.DTOs.Property;
using RealEstateApp.Business.Mapping;
using RealEstateApp.Business.Services;
using RealEstateApp.Core.Entities;
using RealEstateApp.Core.Interfaces;
using Xunit;

namespace RealEstateApp.Tests.Services
{
    public class PropertyServiceTests
    {
        private readonly Mock<IGenericRepository<Property>> _propertyRepoMock;
        private readonly Mock<IGenericRepository<PropertyPhoto>> _photoRepoMock;
        private readonly IMapper _mapper;
        private readonly PropertyService _service;

        public PropertyServiceTests()
        {
            _propertyRepoMock = new Mock<IGenericRepository<Property>>();
            _photoRepoMock = new Mock<IGenericRepository<PropertyPhoto>>();

            var config = new MapperConfiguration(cfg => cfg.AddProfile<MappingProfile>());
            _mapper = config.CreateMapper();

            _service = new PropertyService(
                _propertyRepoMock.Object,
                _photoRepoMock.Object,
                _mapper
            );
        }

        // ---------------- InMemory Helper ----------------
        private static DbContextOptions<TestDbContext> CreateNewContextOptions()
        {
            return new DbContextOptionsBuilder<TestDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;
        }

        private class TestDbContext : DbContext
        {
            public TestDbContext(DbContextOptions<TestDbContext> options) : base(options) { }
            public DbSet<Property> Properties { get; set; }
            public DbSet<PropertyPhoto> Photos { get; set; }
            public DbSet<PropertyType> PropertyTypes { get; set; }
            public DbSet<PropertyStatus> PropertyStatuses { get; set; }
            public DbSet<Currency> Currencies { get; set; }
        }

        [Fact]
        public async Task GetAllAsync_ShouldReturnList_WhenDataExists()
        {
            // Arrange - InMemory veritabanı
            var options = CreateNewContextOptions();
            using (var context = new TestDbContext(options))
            {
                var type = new PropertyType { Id = 1, Name = "Daire" };
                var status = new PropertyStatus { Id = 1, Name = "Satılık" };
                var currency = new Currency
                {
                    Id = 1,
                    Code = "USD",
                    Symbol = "$" // Required alan
                };

                context.PropertyTypes.Add(type);
                context.PropertyStatuses.Add(status);
                context.Currencies.Add(currency);

                context.Properties.Add(new Property
                {
                    Id = 1,
                    Title = "Test",
                    Description = "Desc",
                    Price = 100,
                    Currency = currency,
                    PropertyType = type,
                    PropertyStatus = status,
                    StartDate = DateTime.Now
                });
                context.SaveChanges();
            }

            using (var context = new TestDbContext(options))
            {
                var repoMock = new Mock<IGenericRepository<Property>>();
                repoMock.Setup(r => r.Query()).Returns(context.Properties.Include(p => p.PropertyType)
                                                                         .Include(p => p.PropertyStatus)
                                                                         .Include(p => p.Currency));

                var service = new PropertyService(repoMock.Object, _photoRepoMock.Object, _mapper);

                // Act
                var result = await service.GetAllAsync();

                // Assert
                result.Should().HaveCount(1);
                result[0].Title.Should().Be("Test");
            }
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnNull_WhenNotFound()
        {
            var options = CreateNewContextOptions();
            using (var context = new TestDbContext(options))
            {
                // Context boş, property eklenmedi
            }

            using (var context = new TestDbContext(options))
            {
                var repoMock = new Mock<IGenericRepository<Property>>();
                repoMock.Setup(r => r.Query()).Returns(context.Properties.Include(p => p.PropertyType)
                                                                         .Include(p => p.PropertyStatus)
                                                                         .Include(p => p.Currency)
                                                                         .Include(p => p.Photos));

                var service = new PropertyService(repoMock.Object, _photoRepoMock.Object, _mapper);

                var result = await service.GetByIdAsync(999);

                result.Should().BeNull();
            }
        }

        [Fact]
        public async Task CreateAsync_ShouldAddPropertyAndPhotos()
        {
            var dto = new PropertyCreateDto
            {
                Title = "Test",
                Description = "Desc",
                Price = 100,
                CurrencyId = 1,
                PropertyTypeId = 1,
                PropertyStatusId = 1,
                StartDate = DateTime.Now,
                PhotoUrls = new List<string> { "photo1.jpg", "photo2.jpg" }
            };

            _propertyRepoMock.Setup(r => r.AddAsync(It.IsAny<Property>()))
                .Callback<Property>(p => p.Id = 1);

            var id = await _service.CreateAsync(dto);

            id.Should().Be(1);
            _photoRepoMock.Verify(r => r.AddAsync(It.Is<PropertyPhoto>(ph => ph.PhotoUrl == "photo1.jpg")), Times.Once);
            _photoRepoMock.Verify(r => r.AddAsync(It.Is<PropertyPhoto>(ph => ph.PhotoUrl == "photo2.jpg")), Times.Once);
            _propertyRepoMock.Verify(r => r.SaveAsync(), Times.Once);
        }

        [Fact]
        public async Task UpdateAsync_ShouldReturnFalse_WhenNotFound()
        {
            _propertyRepoMock.Setup(r => r.GetByIdAsync(It.IsAny<int>()))
                .ReturnsAsync((Property)null);

            var result = await _service.UpdateAsync(new PropertyUpdateDto { Id = 1 });

            result.Should().BeFalse();
        }

        [Fact]
        public async Task UpdateAsync_ShouldUpdate_WhenFound()
        {
            var property = new Property { Id = 1, Title = "Old" };
            _propertyRepoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(property);

            var result = await _service.UpdateAsync(new PropertyUpdateDto
            {
                Id = 1,
                Title = "New"
            });

            result.Should().BeTrue();
            _propertyRepoMock.Verify(r => r.Update(It.Is<Property>(p => p.Title == "New")), Times.Once);
            _propertyRepoMock.Verify(r => r.SaveAsync(), Times.Once);
        }

        [Fact]
        public async Task DeleteAsync_ShouldReturnFalse_WhenNotFound()
        {
            _propertyRepoMock.Setup(r => r.GetByIdAsync(It.IsAny<int>()))
                .ReturnsAsync((Property)null);

            var result = await _service.DeleteAsync(5);

            result.Should().BeFalse();
        }

        [Fact]
        public async Task DeleteAsync_ShouldDelete_WhenFound()
        {
            var property = new Property { Id = 1 };
            _propertyRepoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(property);

            var result = await _service.DeleteAsync(1);

            result.Should().BeTrue();
            _propertyRepoMock.Verify(r => r.Delete(property), Times.Once);
            _propertyRepoMock.Verify(r => r.SaveAsync(), Times.Once);
        }
    }
}
