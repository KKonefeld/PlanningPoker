namespace PlanningPoker.Models.UserStory
{
    public class UserStoryDto
    {
        public UserStoryDto()
        {
            Tasks = new List<UserStoryTaskDto>();
        }

        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }

        public IList<UserStoryTaskDto> Tasks { get; set; }
    }
}
