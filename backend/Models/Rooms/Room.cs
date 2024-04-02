﻿namespace PlanningPoker.Models.Rooms
{
    public class Room
    {
        public Room()
        {
            Participants = new List<Participant>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public int Capacity { get; set; }
        public DateTime CreatedAt { get; set; }
        public IList<Participant> Participants { get; set; }
        public VotingSystem VotingSystem { get; set; }

    }
}