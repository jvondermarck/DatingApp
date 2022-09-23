using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Photos")]
    public class Photo
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public bool IsMain { get; set; }
        public string PublicId { get; set; }

        // to make Photos table with a UserID not null, and a delete cascade, we need to specify this : 
        public AppUser AppUser { get; set; }
        public int AppUserId { get; set; }
    }
}