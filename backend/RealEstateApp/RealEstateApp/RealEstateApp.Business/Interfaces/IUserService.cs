using RealEstateApp.Core.Entities;

namespace RealEstateApp.Business.Interfaces
{
    public interface IUserService
    {
        Task<User?> AuthenticateAsync(string username, string password);
        Task AddUserAsync(User user);
        Task<User?> GetByUsernameAsync(string username);

    }
}
