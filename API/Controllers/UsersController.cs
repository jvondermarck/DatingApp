using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class UsersController : BaseApiController
    {
        private readonly DataContext _context;

        public UsersController(DataContext context)
        {
            _context = context;
        }

        [HttpGet] // When <Task> come back, we return the list of Users (asynchronous)
        [AllowAnonymous] // everyone can access to it without being authenticated
        public async Task<ActionResult<IEnumerable<AppUser>>> GetUsers()
        {
            return await _context.Users.ToListAsync(); // return list of users asynchronous (we wait to fetch all data)
        }

        // api/users/3
        [Authorize] // need to be authenticated to see it, with a token needed
        [HttpGet("{id}")]
        public async Task<AppUser> GetUser(int id)
        {
            return await _context.Users.FindAsync(id);
        }
    }
}