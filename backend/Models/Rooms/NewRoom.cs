using System.Text.Json.Serialization;

namespace PlanningPoker.Models.Rooms
{
    public class NewRoom
    {
        public string Name { get; set; }
        public int Capacity { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public VotingSystem VotingSystem { get; set; }
    }
}
