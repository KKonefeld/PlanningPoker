namespace PlanningPoker.Models.Rooms
{
    public class Participant
    {
        public Participant(string name, bool isOwner = false)
        {
            Name = name;
            Role = isOwner ? ParticipantRole.Owner : ParticipantRole.Base;
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public ParticipantRole Role { get; set; }
        public string? Choice { get; set; }
    }
}
