namespace PlanningPoker.Models.Rooms
{
    public class RoomDto
    {
        public string Name { get; set; }
        public int Capacity { get; set; }
        public DateTime CreatedAt { get; set; }
        public IList<Participant> Participants { get; set; }
        public VotingSystem VotingSystem { get; set; }
    }
}
