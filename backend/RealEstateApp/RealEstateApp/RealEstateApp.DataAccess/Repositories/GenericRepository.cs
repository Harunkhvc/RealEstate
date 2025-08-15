using Microsoft.EntityFrameworkCore;
using RealEstateApp.Core.Interfaces;
using RealEstateApp.DataAccess.Context;
using System.Linq.Expressions;

namespace RealEstateApp.DataAccess.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        protected readonly RealEstateDbContext _context;
        public GenericRepository(RealEstateDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<T>> GetAllAsync()
            => await _context.Set<T>().ToListAsync();

        public async Task<T?> GetByIdAsync(int id)
            => await _context.Set<T>().FindAsync(id);

        public async Task AddAsync(T entity)
        {
            await _context.Set<T>().AddAsync(entity);
        }

        public void Update(T entity)
        {
            _context.Set<T>().Update(entity);
        }

        public void Delete(T entity)
        {
            _context.Set<T>().Remove(entity);
        }

        public async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate)
            => await _context.Set<T>().Where(predicate).ToListAsync();

        public IQueryable<T> Query()
            => _context.Set<T>().AsQueryable();

        // Burası eksikti:
        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
