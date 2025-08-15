using System.Security.Claims;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Moq;
using RealEstateApp.API.Controllers;
using RealEstateApp.Business.Interfaces;
using RealEstateApp.Core.Entities;
using Xunit;

namespace RealEstateApp.Tests.Controllers
{
    public class AuthControllerTests
    {
        private readonly Mock<IUserService> _userServiceMock;
        private readonly IConfiguration _config;
        private readonly AuthController _controller;

        public AuthControllerTests()
        {
            _userServiceMock = new Mock<IUserService>();

            // JwtHelper -> config["Jwt:Key|Issuer|Audience|ExpiresInMinutes"]
            var jwt = new Dictionary<string, string?>
            {
                ["Jwt:Key"] = "THIS_IS_A_DEMO_SECRET_KEY_32_LEN",
                ["Jwt:Issuer"] = "test-issuer",
                ["Jwt:Audience"] = "test-audience",
                ["Jwt:ExpiresInMinutes"] = "60"
            };

            _config = new ConfigurationBuilder()
                .AddInMemoryCollection(jwt!)
                .Build();

            _controller = new AuthController(_userServiceMock.Object, _config);
        }

        [Fact]
        public async Task Login_ShouldReturnUnauthorized_WhenCredentialsInvalid()
        {
            var req = new LoginRequestDto { Username = "u", Password = "p" };
            _userServiceMock.Setup(s => s.AuthenticateAsync("u", "p"))
                            .ReturnsAsync((User?)null);

            var result = await _controller.Login(req);

            result.Should().BeOfType<UnauthorizedObjectResult>();
        }

        [Fact]
        public async Task Login_ShouldReturnOk_WithTokenAndUser_WhenValid()
        {
            var user = new User { Id = 5, Username = "harun", Role = "admin", Password = "x" };
            var req = new LoginRequestDto { Username = "harun", Password = "x" };
            _userServiceMock.Setup(s => s.AuthenticateAsync("harun", "x"))
                            .ReturnsAsync(user);

            var result = await _controller.Login(req);

            var ok = result.Should().BeOfType<OkObjectResult>().Subject;
            ok.Value.Should().NotBeNull();

            // Token değerinin kendisini değil, alanların varlığını ve user eşleşmesini doğruluyoruz.
            var anon = ok.Value!.GetType().GetProperty("token")!.GetValue(ok.Value, null);
            anon.Should().BeOfType<string>().And.NotBeNull();

            ok.Value.Should().BeEquivalentTo(new
            {
                user = new { Id = user.Id, Username = user.Username, Role = user.Role }
            }, opt => opt.ExcludingMissingMembers());
        }

        [Fact]
        public async Task Register_ShouldReturnBadRequest_WhenUsernameExists()
        {
            var req = new RegisterRequestDto { Username = "harun", Password = "123" };
            _userServiceMock.Setup(s => s.GetByUsernameAsync("harun"))
                            .ReturnsAsync(new User { Id = 1, Username = "harun" });

            var result = await _controller.Register(req);

            result.Should().BeOfType<BadRequestObjectResult>();
        }

        [Fact]
        public async Task Register_ShouldReturnOk_WhenNewUser()
        {
            var req = new RegisterRequestDto { Username = "newuser", Password = "123" };
            _userServiceMock.Setup(s => s.GetByUsernameAsync("newuser"))
                            .ReturnsAsync((User?)null);

            _userServiceMock.Setup(s => s.AddUserAsync(It.IsAny<User>()))
                            .Returns(Task.CompletedTask)
                            .Verifiable();

            var result = await _controller.Register(req);

            var ok = result.Should().BeOfType<OkObjectResult>().Subject;
            ok.Value.Should().NotBeNull();

            _userServiceMock.Verify(s => s.AddUserAsync(It.Is<User>(u =>
                u.Username == "newuser" && u.Password == "123" && u.Role == "user"
            )), Times.Once);
        }

        [Fact]
        public void Me_ShouldReturnOk_WithUsername()
        {
            var httpCtx = new DefaultHttpContext
            {
                User = new ClaimsPrincipal(new ClaimsIdentity(
                    new[] { new Claim(ClaimTypes.Name, "harun") }, "TestAuth"))
            };
            _controller.ControllerContext = new ControllerContext { HttpContext = httpCtx };

            var result = _controller.Me();

            var ok = result.Should().BeOfType<OkObjectResult>().Subject;
            ok.Value.Should().BeEquivalentTo(new { username = "harun" });
        }
    }
}
