namespace PlanningPoker.Models.Rooms
{
    public class Participant
    {
        public Participant(int roomId, string name, string connectionId, bool isOwner = false)
        {
            RoomId = roomId;
            Name = name;
            ConnectionId = connectionId;
            Role = isOwner ? ParticipantRole.Owner : ParticipantRole.Base;
            Status = ParticipantStatus.Active;
        }

        public int Id { get; set; }
        public int RoomId { get; set; }
        public string ConnectionId { get; set; }
        public string Name { get; set; }
        public ParticipantRole Role { get; set; }
        public string? Vote { get; set; }
        public ParticipantStatus Status { get; set; }
    }
}
