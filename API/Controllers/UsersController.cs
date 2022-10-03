using API.DTOs;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers
{
    // [Authorize] // need to be authorized for each methods
    public class UsersController : BaseApiController
    {
        // private readonly DataContext _context;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public UsersController(IUserRepository userRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }

        [HttpGet] // When <Task> come back, we return the list of Users (asynchronous)
        [AllowAnonymous] // everyone can access to it without being authenticated
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
        {
            // old : 
            // var users = await _userRepository.GetUsersAsync();
            // var usersToReturn = _mapper.Map<IEnumerable<MemberDto>>(users);

            var users = await _userRepository.GetMembersAsync();
            return Ok(users);
            // old :return await _context.Users.ToListAsync(); // return list of users asynchronous (we wait to fetch all data)
        }

        // api/users/3
        [Authorize] // need to be authenticated to see it, with a token needed
        [HttpGet("{username}")]
        public async Task<MemberDto> GetUser(string username)
        {
            return await _userRepository.GetMemberAsync(username);
        }

        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto) 
        {
            // should give us the user username from the token that the API used to authenticate this user 
            var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _userRepository.GetUserByUsernameAsync(username);

            _mapper.Map(memberUpdateDto, user);
            _userRepository.Update(user);

            if(await _userRepository.SaveAllSync()) return NoContent();
            return BadRequest("Failed to update user.");
        }
    }  
}