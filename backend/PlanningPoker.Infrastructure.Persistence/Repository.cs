using Microsoft.EntityFrameworkCore;
using PlanningPoker.Domain.Core;

namespace PlanningPoker.Infrastructure.Persistence
{
    public class Repository<TAggregateRoot> : IRepository<TAggregateRoot> where TAggregateRoot : AggregateRoot
    {
        private readonly PlanningPokerDbContext _dbContext;

        public Repository(PlanningPokerDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<TAggregateRoot> GetById(int id)
        {
            return await _dbContext.Set<TAggregateRoot>().FindAsync(id);
        }

        public async Task<IEnumerable<TAggregateRoot>> GetAll()
        {
            return await _dbContext.Set<TAggregateRoot>().ToListAsync();
        }

        public async Task Create(TAggregateRoot aggregateRoot)
        {
            await _dbContext.Set<TAggregateRoot>().AddAsync(aggregateRoot);
            await _dbContext.SaveChangesAsync();
        }

        public async Task Update(TAggregateRoot aggregateRoot)
        {
            _dbContext.Set<TAggregateRoot>().Update(aggregateRoot);
            await _dbContext.SaveChangesAsync();
        }

        public async Task Delete(int id)
        {
            var entity = await _dbContext.Set<TAggregateRoot>().FindAsync(id);
            if (entity != null)
            {
                _dbContext.Set<TAggregateRoot>().Remove(entity);
                await _dbContext.SaveChangesAsync();
            }
        }
    }
}
