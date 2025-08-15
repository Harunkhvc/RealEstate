using FluentAssertions;
using Moq;
using MockQueryable.Moq;
using RealEstateApp.Business.DTOs.Lookups;
using RealEstateApp.Business.Services;
using RealEstateApp.Core.Entities;
using RealEstateApp.Core.Interfaces;
using Xunit;
using System.Reflection;
using MockQueryable;

namespace RealEstateApp.Tests.Services
{
    public class PropertyTypeServiceTests
    {
        private readonly Mock<IGenericRepository<PropertyType>> _typeRepoMock;
        private readonly Mock<IGenericRepository<Property>> _propertyRepoMock;
        private readonly PropertyTypeService _service;

        public PropertyTypeServiceTests()
        {
            _typeRepoMock = new Mock<IGenericRepository<PropertyType>>();
            _propertyRepoMock = new Mock<IGenericRepository<Property>>();
            _service = new PropertyTypeService(_typeRepoMock.Object, _propertyRepoMock.Object);
        }

        [Fact]
        public async Task GetAllAsync_ShouldReturnList()
        {
            var data = new List<PropertyType>
            {
                new PropertyType { Id = 1, Name = "Daire" },
                new PropertyType { Id = 2, Name = "Villa" }
            }.BuildMock();

            _typeRepoMock.Setup(r => r.Query()).Returns(data);

            var result = await _service.GetAllAsync();

            result.Should().HaveCount(2);
            result[0].Name.Should().Be("Daire");
        }

        [Fact]
        public async Task CreateAsync_ShouldThrowArgumentException_WhenNameIsEmpty()
        {
            var dto = new PropertyTypeCreateDto { Name = " " };

            var act = async () => await _service.CreateAsync(dto);

            await act.Should().ThrowAsync<ArgumentException>();
        }

        [Fact]
        public async Task CreateAsync_ShouldThrowInvalidOperation_WhenNameExists()
        {
            var dto = new PropertyTypeCreateDto { Name = "Daire" };

            var data = new List<PropertyType> { new PropertyType { Id = 1, Name = "Daire" } }
                .BuildMock();

            _typeRepoMock.Setup(r => r.Query()).Returns(data);

            var act = async () => await _service.CreateAsync(dto);

            await act.Should()
                .ThrowAsync<TargetInvocationException>()
                .Where(e => e.InnerException is InvalidOperationException);
        }

        [Fact]
        public async Task CreateAsync_ShouldAdd_WhenValid()
        {
            var dto = new PropertyTypeCreateDto { Name = "Yeni" };

            var data = new List<PropertyType>().BuildMock();
            _typeRepoMock.Setup(r => r.Query()).Returns(data);
            _typeRepoMock.Setup(r => r.AddAsync(It.IsAny<PropertyType>()))
                .Callback<PropertyType>(p => p.Id = 10);

            var id = await _service.CreateAsync(dto);

            id.Should().Be(10);
            _typeRepoMock.Verify(r => r.SaveAsync(), Times.Once);
        }

        [Fact]
        public async Task UpdateAsync_ShouldReturnFalse_WhenNotFound()
        {
            _typeRepoMock.Setup(r => r.GetByIdAsync(It.IsAny<int>()))
                .ReturnsAsync((PropertyType)null);

            var result = await _service.UpdateAsync(new PropertyTypeUpdateDto { Id = 1, Name = "Test" });

            result.Should().BeFalse();
        }

        [Fact]
        public async Task UpdateAsync_ShouldThrowInvalidOperation_WhenNameExists()
        {
            var entity = new PropertyType { Id = 1, Name = "Eski" };
            _typeRepoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(entity);

            var data = new List<PropertyType>
            {
                new PropertyType { Id = 2, Name = "Yeni" }
            }.BuildMock();

            _typeRepoMock.Setup(r => r.Query()).Returns(data);

            var act = async () => await _service.UpdateAsync(new PropertyTypeUpdateDto { Id = 1, Name = "Yeni" });

            await act.Should()
                .ThrowAsync<TargetInvocationException>()
                .Where(e => e.InnerException is InvalidOperationException);
        }

        [Fact]
        public async Task UpdateAsync_ShouldUpdate_WhenValid()
        {
            var entity = new PropertyType { Id = 1, Name = "Eski" };
            _typeRepoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(entity);

            var data = new List<PropertyType>().BuildMock();
            _typeRepoMock.Setup(r => r.Query()).Returns(data);

            var result = await _service.UpdateAsync(new PropertyTypeUpdateDto { Id = 1, Name = "Yeni" });

            result.Should().BeTrue();
            entity.Name.Should().Be("Yeni");
            _typeRepoMock.Verify(r => r.Update(entity), Times.Once);
            _typeRepoMock.Verify(r => r.SaveAsync(), Times.Once);
        }

        [Fact]
        public async Task DeleteAsync_ShouldReturnNotFound_WhenEntityNotExists()
        {
            _typeRepoMock.Setup(r => r.GetByIdAsync(It.IsAny<int>()))
                .ReturnsAsync((PropertyType)null);

            var (ok, reason) = await _service.DeleteAsync(1);

            ok.Should().BeFalse();
            reason.Should().Be("NotFound");
        }

        [Fact]
        public async Task DeleteAsync_ShouldReturnInUse_WhenHasProperties()
        {
            var entity = new PropertyType { Id = 1, Name = "Test" };
            _typeRepoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(entity);

            var props = new List<Property> { new Property { PropertyTypeId = 1 } }.BuildMock();

            _propertyRepoMock.Setup(r => r.Query()).Returns(props);

            var (ok, reason) = await _service.DeleteAsync(1);

            ok.Should().BeFalse();
            reason.Should().Be("InUse");
        }

        [Fact]
        public async Task DeleteAsync_ShouldDelete_WhenValid()
        {
            var entity = new PropertyType { Id = 1, Name = "Test" };
            _typeRepoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(entity);

            var props = new List<Property>().BuildMock();
            _propertyRepoMock.Setup(r => r.Query()).Returns(props);

            var (ok, reason) = await _service.DeleteAsync(1);

            ok.Should().BeTrue();
            reason.Should().BeNull();
            _typeRepoMock.Verify(r => r.Delete(entity), Times.Once);
            _typeRepoMock.Verify(r => r.SaveAsync(), Times.Once);
        }
    }
}

