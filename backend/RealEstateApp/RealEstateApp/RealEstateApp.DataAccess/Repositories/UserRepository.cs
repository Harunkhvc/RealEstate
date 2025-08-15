using Microsoft.EntityFrameworkCore;
using RealEstateApp.Core.Entities;
using RealEstateApp.Core.Interfaces;
using RealEstateApp.DataAccess.Context;

namespace RealEstateApp.DataAccess.Repositories
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        public UserRepository(RealEstateDbContext context) : base(context) { }

        public async Task<User?> GetByUsernameAsync(string username)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
        }
    }
}
