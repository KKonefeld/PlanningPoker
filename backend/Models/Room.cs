namespace PlanningPoker.Models
{
    public class Room
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Capacity { get; set; }
        public DateTime CreatedAt { get; set; }
        public Participant Owner { get; set; }
        public IList<Participant> Participants { get; set; }
        public VotingSystem VotingSystem { get; set; }

    }
}
