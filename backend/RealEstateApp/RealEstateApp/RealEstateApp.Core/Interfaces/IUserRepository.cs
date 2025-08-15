using RealEstateApp.Core.Entities;

namespace RealEstateApp.Core.Interfaces
{
    public interface IUserRepository : IGenericRepository<User>
    {
        Task<User?> GetByUsernameAsync(string username);
    }
}
