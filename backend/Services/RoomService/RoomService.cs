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
            var existingParticipant = await _dbContext.Participants.FirstOrDefaultAsync(p => p.RoomId == roomId && p.Name == participantName);
            
            if (existingParticipant != null)
                return await Rejoin(existingParticipant, connectionId);

            return await AddParticipant(roomId, participantName, connectionId);
        }

        private async Task<bool> Rejoin(Participant existingParticipant, string newConnectionId)
        {
            existingParticipant.Status = ParticipantStatus.Active;
            existingParticipant.ConnectionId = newConnectionId;

            try
            {
                _dbContext.Update(existingParticipant);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
        }

        private async Task<bool> AddParticipant(int roomId, string participantName, string connectionId)
        {
            var participant = await CreateParticipant(roomId, participantName, connectionId);
            var room = _dbContext.Rooms.FirstOrDefault(r => r.Id == roomId);

            if (room == null)
            {
                return false;
            }

            room.Participants.Add(participant);
            await _dbContext.SaveChangesAsync();
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
                .Where(p => p.Status == ParticipantStatus.Active)
                .Where(p => p.ConnectionId == connectionId)
                .FirstOrDefaultAsync(p => p.Name == participantName);

            if (participant == null)
                throw new Exception("Participant not found");

            participant.Vote = voteValue;
            await _dbContext.SaveChangesAsync();
        }

        public async Task<Participant?> LeaveRoom(string connectionId)
        {
            var participant = await _dbContext.Participants.FirstOrDefaultAsync(p => p.ConnectionId == connectionId);

            if (participant != null)
            {
                participant.Status = ParticipantStatus.Disconnected;
                await _dbContext.SaveChangesAsync();
            }

            return participant;
        }
    }
}
