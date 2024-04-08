namespace PlanningPoker.Models.Participants
{
    public class VotingState(string name, bool hasVoted)
    {
        public string Name { get; set; } = name;
        public bool Value { get; set; } = hasVoted;
    }
}
