using Microsoft.AspNetCore.SignalR;
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
            await _roomService.Join(roomId, participantName, Context.ConnectionId);

            var room = await _roomService.GetById(roomId);

            if (room == null)
                throw new Exception($"Room { roomId } not found");

            var groupName = GetGroupName(room);

            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            await Clients.Group(room.Name).SendAsync($"User Joined", participantName);
            await Clients.Caller.SendAsync("RoomDetails", room);
        }

        public async Task SubmitVote(int roomId, string participantName, string voteValue)
        {
            await _roomService.SubmitVote(participantName, Context.ConnectionId, voteValue);
            var room = await _roomService.GetById(roomId);

            if (room == null)
                throw new Exception($"Room { roomId } not found");

            await Clients.Group(GetGroupName(room)).SendAsync("VoteSubmitted", participantName, voteValue);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var participant = await _roomService.LeaveRoom(Context.ConnectionId);

            if (participant != null)
            {
                var room = await _roomService.GetByConnectionId(Context.ConnectionId);
                if (room != null)
                {
                    await Groups.RemoveFromGroupAsync(Context.ConnectionId, GetGroupName(room));
                    await Clients.Group(room.Name).SendAsync("UserLeft", participant.Name);
                }
            }
            await base.OnDisconnectedAsync(exception);
        }

        private string GetGroupName(Room room)
        {
            return $"{ room.Id }. { room.Name }";
        }
    }
}
