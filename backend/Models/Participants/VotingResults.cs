namespace PlanningPoker.Models.Participants
{
    public class VotingResults(string name, string voteValue)
    {
        public string Name { get; set; } = name;
        public string Value { get; set; } = voteValue;
    }
}
