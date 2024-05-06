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

    public class TshirtSizeMapper()
    {
        private readonly Dictionary<string, int> _map = new Dictionary<string, int>
        {
            { "3XS", 1 },
            { "2XS", 2 },
            { "XS", 3 },
            { "S", 4 },
            { "M", 5 },
            { "L", 6 },
            { "XL", 7 },
            { "2XL", 8 },
            { "3XL", 9 },
            { "4XL", 10 }
        };

        public int MapFromTshirtSize(string value)
        {
            return _map[value];
        }

        public string MapToTshirtSize(int value)
        {
            return _map.FirstOrDefault(s => s.Value == value).Key;
        }
    }
}
