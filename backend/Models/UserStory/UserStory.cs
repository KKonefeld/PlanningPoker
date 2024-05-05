namespace PlanningPoker.Models.UserStory
{
    public class UserStory
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public IList<UserStoryTask> Tasks { get; set; }
        public int RoomId { get; set; }

        public UserStory()
        {
            Tasks = new List<UserStoryTask>();
        }
    }
}
