using Microsoft.EntityFrameworkCore;
using PlanningPoker.Domain.Room.Models;

namespace PlanningPoker.Infrastructure.Persistence
{
    public class PlanningPokerDbContext : DbContext
    {
        public DbSet<Room> Rooms { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            // optionsBuilder.UseProvider(connectionString);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            
        }
    }
}
