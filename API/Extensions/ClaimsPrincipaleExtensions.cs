using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace API.Extensions
{
    public static class ClaimsPrincipaleExtensions
    {
        public static string GetUsername(this ClaimsPrincipal user) // will get the unique_name property in the encrypted in the token 
        {
            return user.FindFirst(ClaimTypes.Name)?.Value; // represent the UniqueName property defined in TokenServoce.cs
        }

        public static int GetUserId(this ClaimsPrincipal user) // will get the nameid property in the encrypted in the token 
        {
            return int.Parse(user.FindFirst(ClaimTypes.NameIdentifier)?.Value); // represent the NameId property defined in TokenServoce.cs
        }
    }
}