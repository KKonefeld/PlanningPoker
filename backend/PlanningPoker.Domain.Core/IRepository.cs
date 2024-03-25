namespace PlanningPoker.Domain.Core
{
    public interface IRepository<TAggregateRoot> where TAggregateRoot : AggregateRoot
    {
        Task<TAggregateRoot> GetById(int id);
        Task<IEnumerable<TAggregateRoot>> GetAll();
        Task Create(TAggregateRoot aggregateRoot);
        Task Update(TAggregateRoot aggregateRoot);
        Task Delete(int id);
    }
}
