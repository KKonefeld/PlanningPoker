using Microsoft.EntityFrameworkCore;
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

        public async Task<int> Create(NewRoom newRoom)
        {
            var room = new Room
            {
                Name = newRoom.Name,
                Capacity = newRoom.Capacity,
                CreatedAt = DateTime.UtcNow,
                VotingSystem = (VotingSystem)Enum.Parse(typeof(VotingSystem), newRoom.VotingSystem)
            };

            await _dbContext.Rooms.AddAsync(room);
            await _dbContext.SaveChangesAsync();
            return room.Id;
        }

        public async Task<int> Update(Room room)
        {
            //_dbContext.Rooms.Update(room);
            //await _dbContext.SaveChangesAsync();
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

        public async Task<bool> Join(int roomId, string participantName)
        {
            var participant = await CreateParticipant(participantName);
            var room = _dbContext.Rooms.FirstOrDefault(r => r.Id == roomId);

            if (room == null)
            {
                return false;
            }

            room.Participants.Add(participant);
            await _dbContext.SaveChangesAsync();
            return true;
        }

        private async Task<Participant> CreateParticipant(string participantName)
        {
            var participant = new Participant(participantName);
            await _dbContext.Participants.AddAsync(participant);
            await _dbContext.SaveChangesAsync();
            return participant;
        }
    }
}
