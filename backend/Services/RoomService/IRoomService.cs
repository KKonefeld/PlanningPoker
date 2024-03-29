using PlanningPoker.Models;

namespace PlanningPoker.Services.RoomService
{
    public interface IRoomService
    {
        Task<IEnumerable<Room>> GetAll();
        Task<Room?> GetById(int id);
        Task<int> Create(Room room);
        Task<int> Update(Room room);
        Task<bool> Delete(int id);

    }
}
