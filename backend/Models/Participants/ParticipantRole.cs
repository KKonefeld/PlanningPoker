using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.Runtime.Serialization;

namespace PlanningPoker.Models.Participants
{
    [JsonConverter(typeof(StringEnumConverter))]
    public enum ParticipantRole
    {
        [EnumMember(Value = "BASE")]
        Base,

        [EnumMember(Value = "OWNER")]
        Owner
    }
}
