using PlanningPoker.Models.Rooms;

namespace PlanningPoker.Services.RoomService
{
    public interface IRoomService
    {
        Task<IEnumerable<Room>> GetAll();
        Task<Room?> GetById(int id);
        Task<Room?> GetByConnectionId(string connectionId);
        Task<int> Create(NewRoom room);
        Task<bool> Delete(int id);

        Task<bool> Join(int roomId, string participantName, string connectionId);
        Task SubmitVote(string participantName, string connectionId, string voteValue);
        Task<Participant?> LeaveRoom(string connectionId);

    }
}
