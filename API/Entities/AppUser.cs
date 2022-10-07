using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Extensions;

namespace API.Entities
{
    public class AppUser
    {
        public int Id {get; set;}
        public string UserName {get; set;}
        public byte[] PasswordHash {get;set;} // byte to hash the password
        public byte[] PasswordSalt {get;set;}
        public DateTime DateOfBirth {get;set;}
        public string KnownAs { get; set; }
        public DateTime Created { get; set; } = DateTime.Now;
        public DateTime LastActive { get; set; } = DateTime.Now;
        public string Gender { get; set; }
        public string Introduction { get; set; }
        public string LookingFor { get; set; }
        public string Interests { get; set; }
        public string City { get; set; }
        public string Country { get; set; }

        public ICollection<Photo> Photos { get; set; } = new List<Photo>();
        public ICollection<UserLike> LikedByUsers { get; set; } // list of users that liked the current logged in user
        public ICollection<UserLike> LikedUsers { get; set; } // list of users that the current logged in user has liked

        // public int GetAge()
        // {
        //     return DateOfBirth.CalculateAge();
        // }

    } 
}