using Microsoft.AspNetCore.Mvc;
using PlanningPoker.Models;
using PlanningPoker.Services;

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

        [HttpGet("{roomId}")]
        public async Task<IActionResult> Get([FromRoute] int roomId)
        {
            var result = await _roomService.GetById(roomId);
            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _roomService.GetAll();
            return Ok(result);
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] Room room)
        {
            if (room == null)
            {
                return BadRequest("Invalid room object");
            }

            var result = await _roomService.Create(room);
            return Ok(result);
        }

        [HttpPut("update")]
        public async Task<IActionResult> Update([FromBody] Room room)
        {
            if (room == null)
            {
                return BadRequest("Invalid room object");
            }

            var result = await _roomService.Update(room);
            return Ok(result);
        }

        [HttpDelete("delete/{roomId}")]
        public async Task<IActionResult> Delete([FromRoute] int roomId)
        {
            var result = await _roomService.Delete(roomId);
            return Ok(result);
        }
    }
}
