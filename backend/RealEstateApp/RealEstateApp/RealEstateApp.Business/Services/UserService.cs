using RealEstateApp.Business.Interfaces;
using RealEstateApp.Core.Entities;
using RealEstateApp.Core.Interfaces;

namespace RealEstateApp.Business.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<User?> AuthenticateAsync(string username, string password)
        {
            // Şimdilik plain text, ileride hashli doğrulama ile güncelleyeceğiz!
            var user = await _userRepository.GetByUsernameAsync(username);
            if (user == null || user.Password != password)
                return null;
            return user;
        }

        public async Task AddUserAsync(User user)
        {
            await _userRepository.AddAsync(user);
            await _userRepository.SaveAsync();
        }
        public async Task<User?> GetByUsernameAsync(string username)
        {
            return await _userRepository.GetByUsernameAsync(username);
        }

    }
}
