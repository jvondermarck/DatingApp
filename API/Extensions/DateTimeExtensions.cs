using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Extensions
{
    public static class DateTimeExtensions
    {
        public static int CalculateAge(this DateTime dob)
        {
            var today = DateTime.Today;
            var age = today.Year - dob.Year;    
            if(dob.Date > today.AddYears(-age)) age--; // means that they havan't yet get their birthday during the year they have to have their birthday
            return age;
        }
    }
}