using Microsoft.AspNetCore.SignalR;

namespace PlanningPoker.SignalR.Hubs
{
    public class RoomHub : Hub
    {
        public async Task BroadcastRefreshRoomList()
        {
            await Clients.All.SendAsync("RefreshRoomList");
        }

        public async Task BroadcastJoinedRoom(int roomId, string participantName)
        {
            await Clients.Group(roomId.ToString()).SendAsync("ParticipantJoined", roomId, participantName);
        }
    }
}
