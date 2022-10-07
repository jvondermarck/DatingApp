using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {
            
        }

        public DbSet<AppUser> Users { get; set; } // very important to use to insert, select data, and so on
        public DbSet<UserLike> Likes { get; set; }
        protected override void OnModelCreating(ModelBuilder builder) 
        {
            base.OnModelCreating(builder);
            // Sets the properties that make up the primary key for this entity type.
            builder.Entity<UserLike>().HasKey(k => new {k.SourceUserId, k.LikedUserId});
            // it means that we will have two columns in our table "Likes" which are SourceUserId and LikedUserId

            // a source user (the logged in user) can liked many others users 
            builder.Entity<UserLike>().HasOne(s => s.SourceUser).WithMany(l => l.LikedUsers)
                .HasForeignKey(s => s.SourceUserId).OnDelete(DeleteBehavior.Cascade);
            // if using SQL SERVER : put DeleteBehavior.NoAction

            // an user 
            builder.Entity<UserLike>().HasOne(s => s.LikedUser).WithMany(l => l.LikedByUsers)
                .HasForeignKey(s => s.LikedUserId).OnDelete(DeleteBehavior.Cascade);
        }
    }
}