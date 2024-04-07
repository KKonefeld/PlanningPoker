using Microsoft.EntityFrameworkCore;
using PlanningPoker.Models.Participants;
using PlanningPoker.Models.Rooms;
using PlanningPoker.Persistence;

namespace PlanningPoker.Services.RoomService
{
    public class RoomService : IRoomService
    {
        private readonly PlanningPokerDbContext _dbContext;

        public RoomService(PlanningPokerDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IEnumerable<Room>> GetAll()
        {
            return await _dbContext.Rooms
                .Include(r => r.Participants)
                .ToListAsync();
        }

        public async Task<Room?> GetById(int id)
        {
            return await _dbContext.Rooms
                .Include(r => r.Participants)
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<Room?> GetByConnectionId(string connectionId)
        {
            return await _dbContext.Rooms
                .Include(r => r.Participants)
                .FirstOrDefaultAsync(r => r.Participants.Any(p => p.ConnectionId == connectionId));
        }

        public async Task<int> Create(NewRoom newRoom)
        {

            var room = new Room
            {
                Name = newRoom.Name,
                Capacity = newRoom.Capacity,
                CreatedAt = DateTime.UtcNow,
                VotingSystem = newRoom.VotingSystem
            };

            await _dbContext.Rooms.AddAsync(room);
            await _dbContext.SaveChangesAsync();
            return room.Id;
        }

        public async Task<bool> Delete(int id)
        {
            var room = await _dbContext.Rooms.FindAsync(id);
            if (room == null)
            {
                return false;
            }

            _dbContext.Rooms.Remove(room);
            await _dbContext.SaveChangesAsync();

            return true;
        }

        public async Task<bool> Join(int roomId, string participantName, string connectionId)
        {
            var room = _dbContext.Rooms.FirstOrDefault(r => r.Id == roomId);

            if (room == null)
            {
                return false;
            }

            await CreateParticipant(roomId, participantName, connectionId);
            return true;
        }

        private async Task<Participant> CreateParticipant(int roomId, string participantName, string connectionId)
        {
            var participant = new Participant(roomId, participantName, connectionId);
            await _dbContext.Participants.AddAsync(participant);
            await _dbContext.SaveChangesAsync();
            return participant;
        }

        public async Task SubmitVote(string participantName, string connectionId, string voteValue)
        {
            var participant = await _dbContext.Participants
                .Where(p => p.ConnectionId == connectionId)
                .FirstOrDefaultAsync(p => p.Name == participantName);

            if (participant == null)
                throw new Exception("Participant not found");

            participant.Vote = voteValue;
            await _dbContext.SaveChangesAsync();
        }

        public async Task<Participant?> GetParticipantByConnectionId(string connectionId)
        {
            return await _dbContext.Participants.FirstOrDefaultAsync(p => p.ConnectionId == connectionId);
        }

        public async Task LeaveRoom(Participant participant)
        {
            _dbContext.Remove(participant);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<bool> HaveAllActiveParticipantsVoted(int roomId)
        {
            var room = await GetById(roomId);

            if (room == null)
                return false;

            return room.Participants.All(p => p.Vote != null);
        }

        public IList<VotingState> GetVotingState(Room room)
        {
            return room.Participants.OrderBy(p => p.Id).Select(participant => (new VotingState(participant.Name, participant.Vote != null))).ToList();
        }

        public IList<VotingResults> GetVotingResults(Room room)
        {
            return room.Participants.OrderBy(p => p.Id).Select(participant => new VotingResults(participant.Name, participant.Vote!)).ToList();
        }
    }
}
