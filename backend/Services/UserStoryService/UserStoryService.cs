using Microsoft.EntityFrameworkCore;
using PlanningPoker.Models.UserStory;
using PlanningPoker.Persistence;
using UserStory = PlanningPoker.Models.UserStory.UserStory;

namespace PlanningPoker.Services.UserStoryService
{
    public class UserStoryService : IUserStoryService
    {
        private readonly PlanningPokerDbContext _dbContext;

        public UserStoryService(PlanningPokerDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<bool> AddUserStory(UserStory userStory)
        {
            try
            {
                await _dbContext.UserStories.AddAsync(userStory);
                await _dbContext.SaveChangesAsync();

                return true;
            }

            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
        }

        public async Task<bool> UpdateUserStory(int roomId, int userStoryId, string name, string description)
        {
            try
            {
                var userStory =
                    await _dbContext.UserStories.FirstOrDefaultAsync(us => us.Id == userStoryId && us.RoomId == roomId);

                if (userStory == null)
                    throw new Exception("No User Story with given ID");

                userStory.Title = name;
                userStory.Description = description;

                _dbContext.Update(userStory);
                await _dbContext.SaveChangesAsync();

                return true;
            }

            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
        }

        public async Task<bool> DeleteUserStory(int roomId, int userStoryId)
        {
            try
            {
                var userStory =
                    await _dbContext.UserStories.FirstOrDefaultAsync(us => us.Id == userStoryId && us.RoomId == roomId);

                if (userStory == null)
                    throw new Exception("No User Story with given ID");

                _dbContext.UserStories.Remove(userStory);
                await _dbContext.SaveChangesAsync();

                return true;
            }

            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
        }

        public async Task DeleteRoomUserStories(int roomId)
        {
            var userStories =
                await _dbContext.UserStories
                    .Include(us => us.Tasks)
                    .Where(us => us.RoomId == roomId)
                    .ToListAsync();

            if (!userStories.Any())
                return;

            foreach (var userStory in userStories)
            {
                _dbContext.UserStoryTasks.RemoveRange(userStory.Tasks);
            }

            _dbContext.UserStories.RemoveRange(userStories);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<IList<UserStoryDto>> ListUserStories(int roomId)
        {
            var userStories = await _dbContext.UserStories
                .Include(us => us.Tasks)
                .Where(us => us.RoomId == roomId).ToListAsync();

            var userStoryListItems = userStories.Select(us => new UserStoryDto
            {
                Id = us.Id,
                Title = us.Title,
                Description = us.Description,
                Tasks = UserStoryTaskDto(us.Tasks)
            }).ToList();

            return userStoryListItems;
        }

        public async Task<UserStoryDto?> GetUserStoryDetails(int userStoryId)
        {
            var userStory =
                await _dbContext.UserStories
                    .Include(us => us.Tasks)
                    .FirstOrDefaultAsync(us => us.Id == userStoryId);

            if (userStory == null)
                return null;

            var userStoryDto = new UserStoryDto
            {
                Id = userStory.Id,
                Title = userStory.Title,
                Description = userStory.Description
            };
            
            userStoryDto.Tasks = UserStoryTaskDto(userStory.Tasks);
            
            return userStoryDto;
        }
        private IList<UserStoryTaskDto> UserStoryTaskDto(IList<UserStoryTask> tasks)
        {
            var tasksDto = new List<UserStoryTaskDto>();

            foreach (var task in tasks)
            {
                tasksDto.Add(new UserStoryTaskDto
                {
                    Id = task.Id,
                    Title = task.Title,
                    Description = task.Description,
                    EstimationResult = task.EstimationResult
                });
            }

            return tasksDto;
        }

        public async Task<bool> CreateUserStoryTask(UserStoryTask task)
        {
            var tasks = await _dbContext.UserStoryTasks.ToListAsync();

            if (tasks.Any(t => t.Title == task.Title))
                return false;

            try
            {
                await _dbContext.UserStoryTasks.AddAsync(task);
                await _dbContext.SaveChangesAsync();

                return true;
            }

            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);

                return false;
            }
        }

        public async Task<bool> UpdateUserStoryTask(int userStoryTaskId, string title, string description)
        {
            var task = await _dbContext.UserStoryTasks.FirstOrDefaultAsync(t => t.Id == userStoryTaskId);

            if (task == null)
                return false;
            
            try
            {
                _dbContext.UserStoryTasks.Update(task);
                await _dbContext.SaveChangesAsync();

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                
                return false;
            }
        }

        public async Task<bool> DeleteUserStoryTask(int userStoryTaskId)
        {
            var task = await _dbContext.UserStoryTasks.FirstOrDefaultAsync(t => t.Id == userStoryTaskId);

            if (task == null)
                return false;

            try
            {
                _dbContext.UserStoryTasks.Remove(task);
                await _dbContext.SaveChangesAsync();

                return true;
            }

            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);

                return false;
            }
        }
    }
}
