using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RealEstateApp.API.Helpers;
using RealEstateApp.Business.Interfaces;
using RealEstateApp.Core.Entities;

namespace RealEstateApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IConfiguration _config;

        public AuthController(IUserService userService, IConfiguration config)
        {
            _userService = userService;
            _config = config;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            var user = await _userService.AuthenticateAsync(request.Username, request.Password);
            if (user == null)
                return Unauthorized(new { message = "Kullanıcı adı veya şifre yanlış" });

            var token = JwtHelper.GenerateJwtToken(user, _config);
            return Ok(new
            {
                token,
                user = new { user.Id, user.Username, user.Role }
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
        {
            var existing = await _userService.GetByUsernameAsync(request.Username);
            if (existing != null)
                return BadRequest(new { message = "Bu kullanıcı adı zaten alınmış." });

            var user = new User
            {
                Username = request.Username,
                Password = request.Password, // Dikkat: Plain text! Prod'da hash kullan!
                Role = "user"
            };

            await _userService.AddUserAsync(user);

            return Ok(new { message = "Kayıt başarılı", user = new { user.Id, user.Username } });
        }

        [Authorize]
        [HttpGet("me")]
        public IActionResult Me()
        {
            var username = User.Identity?.Name;
            return Ok(new { username });
        }
    }

    public class LoginRequestDto
    {
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
    }

    public class RegisterRequestDto
    {
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}
