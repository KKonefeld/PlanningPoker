using System.Runtime.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace PlanningPoker.Models.Rooms
{
    [JsonConverter(typeof(StringEnumConverter))]
    public enum VotingSystem
    {
        [EnumMember(Value = "FIBONACCI")]
        Fibonacci,

        [EnumMember(Value = "TSHIRTS")]
        Tshirts
    }
}
