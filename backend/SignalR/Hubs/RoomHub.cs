using Microsoft.AspNetCore.SignalR;
using PlanningPoker.Models.Participants;
using PlanningPoker.Models.Rooms;
using PlanningPoker.Services.RoomService;

namespace PlanningPoker.SignalR.Hubs
{
    public class RoomHub : Hub
    {
        private readonly IRoomService _roomService;

        public RoomHub(IRoomService roomService)
        {
            _roomService = roomService;
        }

        public async Task JoinRoom(int roomId, string participantName)
        {
            var room = await _roomService.GetById(roomId);

            if (room == null)
                throw new Exception($"Room { roomId } not found");

            await _roomService.Join(room, participantName, Context.ConnectionId);

            var groupName = GetGroupName(room);

            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            await Clients.Group(groupName).SendAsync("UserJoined", participantName);
            await Clients.Group(groupName).SendAsync("EveryoneVoted", false);
            await Clients.Caller.SendAsync("RoomDetails", room);

            var votingState = _roomService.GetVotingState(room);
            await Clients.Group(groupName).SendAsync("VotingState", votingState);
        }

        public async Task SubmitVote(int roomId, string participantName, string? voteValue)
        {
            await _roomService.SubmitVote(participantName, Context.ConnectionId, voteValue);
            var room = await _roomService.GetById(roomId);

            if (room == null)
                throw new Exception($"Room { roomId } not found");

            var groupName = GetGroupName(room);

            if (voteValue == null)
            {
                await Clients.Group(groupName).SendAsync("VoteWithdrawn", participantName);
                await Clients.Group(groupName).SendAsync("EveryoneVoted", false);
            }
            else
            {
                await Clients.Group(groupName).SendAsync("VoteSubmitted", participantName);
            }

            if (await IsVotingFinished(roomId))
            {
                await Clients.Group(groupName).SendAsync("EveryoneVoted", true);
                var votingResults = _roomService.GetVotingResults(room);
                await Clients.Group(groupName).SendAsync("VotingResults", votingResults);
                return;
            }

            var votingState = _roomService.GetVotingState(room);
            await Clients.Group(groupName).SendAsync("VotingState", votingState);
        }

        private async Task<bool> IsVotingFinished(int roomId)
        {
            return await _roomService.HaveAllActiveParticipantsVoted(roomId);
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var participant = await _roomService.GetParticipantByConnectionId(Context.ConnectionId);

            if (participant != null)
            {
                var room = await _roomService.GetById(participant.RoomId);
                if (room != null)
                {
                    await Groups.RemoveFromGroupAsync(Context.ConnectionId, GetGroupName(room));
                    await Clients.Group(GetGroupName(room)).SendAsync("UserLeft", participant.Name);

                    await _roomService.LeaveRoom(participant);

                    var votingState = _roomService.GetVotingState(room);
                    await Clients.Group(GetGroupName(room)).SendAsync("VotingState", votingState);
                }
            }

            await base.OnDisconnectedAsync(exception);
        }

        private string GetGroupName(Room room)
        {
            return $"[{ room.Id }] { room.Name }";
        }
    }
}
