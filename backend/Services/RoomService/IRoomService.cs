using PlanningPoker.Models.Rooms;

namespace PlanningPoker.Services.RoomService
{
    public interface IRoomService
    {
        Task<IEnumerable<Room>> GetAll();
        Task<Room?> GetById(int id);
        Task<int> Create(NewRoom room);
        Task<int> Update(Room room);
        Task<bool> Delete(int id);

        Task<bool> Join(int roomId, string participantName);

    }
}
