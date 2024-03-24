using PlanningPoker.Domain.Core;

namespace PlanningPoker.Domain.Room.Models
{
    public class Room : AggregateRoot
    {
        public string Name { get; set; }
        public int Capacity { get; set; }
        public DateTime CreationTime { get; set; }
        // public User Owner { get; set; }
        // public IList<User> Participants { get; set; }
        // Visibility?
        // Session status?
        // Chat messages?

        public Room()
        {
            
        }
    }
}
