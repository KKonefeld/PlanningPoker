using Microsoft.EntityFrameworkCore;
using PlanningPoker.Models;
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
            return await _dbContext.Rooms.ToListAsync();
        }

        public async Task<Room?> GetById(int id)
        {
            return await _dbContext.Rooms.FindAsync(id);
        }

        public async Task<int> Create(Room room)
        {
            await _dbContext.Rooms.AddAsync(room);
            await _dbContext.SaveChangesAsync();
            return room.Id;
        }

        public async Task<int> Update(Room room)
        {
            _dbContext.Rooms.Update(room);
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
    }
}
