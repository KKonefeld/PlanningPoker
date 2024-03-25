using PlanningPoker.Domain.Core;

namespace PlanningPoker.Domain.Room.Models
{
    public class Room : AggregateRoot
    {
        public string Name { get; set; }
        public int Capacity { get; set; }
        public DateTime CreatedAt { get; set; }
        public Participant Owner { get; set; }
        public IList<Participant> Participants { get; set; }
        public VotingSystem VotingSystem { get; set; }

    }
}
