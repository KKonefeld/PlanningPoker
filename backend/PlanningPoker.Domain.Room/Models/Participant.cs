using PlanningPoker.Domain.Core;

namespace PlanningPoker.Domain.Room.Models
{
    public class Participant : Entity
    {
        public string Name { get; set; }
        public string? Choice { get; set; }
    }
}
