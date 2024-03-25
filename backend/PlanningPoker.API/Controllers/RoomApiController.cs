using Microsoft.AspNetCore.Mvc;
using PlanningPoker.Domain.Core;
using PlanningPoker.Domain.Room.Models;

namespace PlanningPoker.API.Controllers
{
    [Route("api/room")]
    [ApiController]
    public class RoomApiController : ControllerBase
    {
        private readonly IRepository<Room> _roomRepository;

        public RoomApiController(IRepository<Room> roomRepository)
        {
            _roomRepository = roomRepository;
        }

        [HttpGet("{roomId}")]
        public async Task<IActionResult> Get(int roomId)
        {
            var result = await _roomRepository.GetById(roomId);

            if (result == null)
                return NotFound();

            return Ok(result);
        }
    }
}
