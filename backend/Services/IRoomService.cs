using PlanningPoker.Models;

namespace PlanningPoker.Services
{
    public interface IRoomService
    {
        Task<Room> GetById(int id);
        Task<IEnumerable<Room>> GetAll();
        Task<int> Create(Room room);
        Task<int> Update(Room room);
        Task<bool> Delete(int id);

    }
}
