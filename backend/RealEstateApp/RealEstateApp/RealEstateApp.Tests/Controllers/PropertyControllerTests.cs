using Microsoft.AspNetCore.Mvc;
using FluentAssertions;
using Moq;
using RealEstateApp.API.Controllers;
using RealEstateApp.Business.Interfaces;
using RealEstateApp.Business.DTOs.Property;
using RealEstateApp.Business.DTOs.Dashboard;

public class PropertyControllerTests
{
    private readonly Mock<IPropertyService> _serviceMock;
    private readonly PropertyController _controller;

    public PropertyControllerTests()
    {
        _serviceMock = new Mock<IPropertyService>();
        _controller = new PropertyController(_serviceMock.Object);
    }

    [Fact]
    public async Task GetAll_ShouldReturnOk_WithData()
    {
        var list = new List<PropertyListDto>
        {
            new PropertyListDto { Id = 1, Title = "Test" }
        };
        _serviceMock.Setup(s => s.GetAllAsync()).ReturnsAsync(list);

        var result = await _controller.GetAll();

        var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
        okResult.Value.Should().BeEquivalentTo(list);
    }

    [Fact]
    public async Task GetById_ShouldReturnOk_WhenFound()
    {
        var dto = new PropertyDetailDto { Id = 1, Title = "Test" };
        _serviceMock.Setup(s => s.GetByIdAsync(1)).ReturnsAsync(dto);

        var result = await _controller.GetById(1);

        var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
        okResult.Value.Should().BeEquivalentTo(dto);
    }

    [Fact]
    public async Task GetById_ShouldReturnNotFound_WhenNotExists()
    {
        _serviceMock.Setup(s => s.GetByIdAsync(1)).ReturnsAsync((PropertyDetailDto?)null);

        var result = await _controller.GetById(1);

        result.Should().BeOfType<NotFoundResult>();
    }

    [Fact]
    public async Task Create_ShouldReturnCreatedAtAction_WithId()
    {
        var dto = new PropertyCreateDto { Title = "Test" };
        _serviceMock.Setup(s => s.CreateAsync(dto)).ReturnsAsync(10);

        var result = await _controller.Create(dto);

        var created = result.Should().BeOfType<CreatedAtActionResult>().Subject;
        created.ActionName.Should().Be(nameof(PropertyController.GetById));
        created.RouteValues.Should().ContainKey("id").WhoseValue.Should().Be(10);
    }

    [Fact]
    public async Task Update_ShouldReturnBadRequest_WhenIdMismatch()
    {
        var dto = new PropertyUpdateDto { Id = 2 };

        var result = await _controller.Update(1, dto);

        result.Should().BeOfType<BadRequestObjectResult>();
    }

    [Fact]
    public async Task Update_ShouldReturnNotFound_WhenNotExists()
    {
        var dto = new PropertyUpdateDto { Id = 1 };
        _serviceMock.Setup(s => s.UpdateAsync(dto)).ReturnsAsync(false);

        var result = await _controller.Update(1, dto);

        result.Should().BeOfType<NotFoundResult>();
    }

    [Fact]
    public async Task Update_ShouldReturnNoContent_WhenUpdated()
    {
        var dto = new PropertyUpdateDto { Id = 1 };
        _serviceMock.Setup(s => s.UpdateAsync(dto)).ReturnsAsync(true);

        var result = await _controller.Update(1, dto);

        result.Should().BeOfType<NoContentResult>();
    }

    [Fact]
    public async Task Delete_ShouldReturnNotFound_WhenNotExists()
    {
        _serviceMock.Setup(s => s.DeleteAsync(1)).ReturnsAsync(false);

        var result = await _controller.Delete(1);

        result.Should().BeOfType<NotFoundResult>();
    }

    [Fact]
    public async Task Delete_ShouldReturnNoContent_WhenDeleted()
    {
        _serviceMock.Setup(s => s.DeleteAsync(1)).ReturnsAsync(true);

        var result = await _controller.Delete(1);

        result.Should().BeOfType<NoContentResult>();
    }

    [Fact]
    public async Task Filter_ShouldReturnOk_WithPagedData()
    {
        var filter = new PropertyFilterDto { Page = 1, PageSize = 10 };
        var data = new List<PropertyListDto> { new PropertyListDto { Id = 1, Title = "T" } };

        _serviceMock.Setup(s => s.FilterAsync(filter)).ReturnsAsync((data, 100));

        var result = await _controller.Filter(filter);

        var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
        okResult.Value.Should().BeEquivalentTo(new
        {
            totalCount = 100,
            page = 1,
            pageSize = 10,
            data
        });
    }

    [Fact]
    public async Task DashboardSummary_ShouldReturnOk()
    {
        var summary = new DashboardSummaryDto();
        _serviceMock.Setup(s => s.GetDashboardSummaryAsync()).ReturnsAsync(summary);

        var result = await _controller.DashboardSummary();

        var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
        okResult.Value.Should().Be(summary);
    }

    [Fact]
    public async Task MapFilter_ShouldReturnOk()
    {
        var filter = new PropertyMapFilterDto();
        var data = new List<PropertyListDto>();

        _serviceMock.Setup(s => s.MapFilterAsync(filter)).ReturnsAsync(data);

        var result = await _controller.MapFilter(filter);

        var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
        okResult.Value.Should().Be(data);
    }

    // --- GÜNCEL: Search artık city/district/q ile FilterAsync üzerinden çalışıyor ---
    [Fact]
    public async Task Search_ShouldReturnOk()
    {
        var data = new List<PropertyListDto> { new PropertyListDto { Id = 1, Title = "X" } };

        _serviceMock
            .Setup(s => s.FilterAsync(It.Is<PropertyFilterDto>(f =>
                f.City == "istanbul" &&
                f.District == "kadikoy" &&
                f.Query == "teras" &&
                f.Page == 1 &&
                f.PageSize == 20)))
            .ReturnsAsync((data, 1));

        // Controller imzası: Search(string? city, string? district, string? q, int page = 1, int pageSize = 20)
        var result = await _controller.Search("istanbul", "kadikoy", "teras", 1, 20);

        var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
        okResult.Value.Should().BeEquivalentTo(new
        {
            totalCount = 1,
            page = 1,
            pageSize = 20,
            data
        });
    }
}
