using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using API.Data;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // [controller] is replaced by the name of the class wich is "Users" from UsersController.cs class
    public class BaseApiController : ControllerBase
    {
        
    }
}