using Microsoft.AspNetCore.Mvc;
using PlanningPoker.Models.Rooms;
using PlanningPoker.Services.RoomService;

namespace PlanningPoker.Controllers
{
    [Route("api/rooms")]
    [ApiController]
    public class RoomApiController : ControllerBase
    {
        private readonly IRoomService _roomService;

        public RoomApiController(IRoomService roomService)
        {
            _roomService = roomService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _roomService.GetAll();
            return Ok(result);
        }

        [HttpGet("{roomId}")]
        public async Task<IActionResult> Get([FromRoute] int roomId)
        {
            var result = await _roomService.GetById(roomId);

            if (result == null)
                return NotFound("Room with given id was not found");

            return Ok(result);
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] NewRoom room)
        {
            if (room == null)
                return BadRequest("Invalid room object");

            var result = await _roomService.Create(room);
            return Ok(result);
        }

        //[HttpPut("update")]
        //public async Task<IActionResult> Update([FromBody] Room room)
        //{
        //    if (room == null)
        //        return BadRequest("Invalid room object");

        //    var result = await _roomService.Update(room);
        //    return Ok(result);
        //}

        [HttpDelete("delete/{roomId}")]
        public async Task<IActionResult> Delete([FromRoute] int roomId)
        {
            var result = await _roomService.Delete(roomId);
            return Ok(result);
        }

        [HttpPost("join/{roomId}")]
        public async Task<IActionResult> Join([FromRoute] int roomId, [FromBody] string participantName)
        {
            var result = await _roomService.Join(roomId, participantName);

            if (!result)
                return BadRequest("Room was not found");

            return Ok(result);
        }

        [HttpGet("participants/{roomId}")]
        public async Task<IActionResult> GetParticipants([FromRoute] int roomId)
        {
            var room = await _roomService.GetById(roomId);
            if (room == null)
                return NotFound("Room was not found");

            var result = room.Participants;
            return Ok(result);
        }
    }
}
