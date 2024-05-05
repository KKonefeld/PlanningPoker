using Microsoft.AspNetCore.Mvc;
using PlanningPoker.Services.UserStoryService;

namespace PlanningPoker.Controllers
{
    [Route("api/user-stories")]
    [ApiController]
    public class UserStoryController : ControllerBase
    {
        private readonly IUserStoryService _userStoryService;

        public UserStoryController(IUserStoryService userStoryService)
        {
            _userStoryService = userStoryService;
        }

        [HttpGet("{roomId}")]
        public async Task<IActionResult> ListUserStories([FromRoute] int roomId)
        {
            var userStoryList = await _userStoryService.ListUserStories(roomId);

            return Ok(userStoryList);
        }

        [HttpGet("/details/{userStoryId}")]
        public async Task<IActionResult> GetUserStoryDetails([FromRoute] int userStoryId)
        {
            var userStory = await _userStoryService.GetUserStoryDetails(userStoryId);

            if (userStory == null)
                return NotFound();

            return Ok(userStory);
        }
    }
}
