using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.Runtime.Serialization;

namespace PlanningPoker.Models.Participants
{
    [JsonConverter(typeof(StringEnumConverter))]
    public enum ParticipantStatus
    {
        [EnumMember(Value = "ACTIVE")]
        Active,

        [EnumMember(Value = "DISCONNECTED")]
        Disconnected
    }
}
