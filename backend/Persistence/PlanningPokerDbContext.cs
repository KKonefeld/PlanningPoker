using Microsoft.EntityFrameworkCore;
using PlanningPoker.Models.Rooms;

namespace PlanningPoker.Persistence
{

    public class PlanningPokerDbContext : DbContext
    {
        public DbSet<Room> Rooms { get; set; }
        public DbSet<Participant> Participants { get; set; }

        public PlanningPokerDbContext(DbContextOptions<PlanningPokerDbContext> options):
            base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.UseIdentityColumns();

            modelBuilder.Entity<Room>()
                .Property(r => r.VotingSystem)
                .HasConversion<string>();

            modelBuilder.Entity<Room>()
                .HasMany(r => r.Participants)
                .WithOne()
                .HasForeignKey(p => p.RoomId);

            modelBuilder.Entity<Participant>()
                .Property(p => p.Role)
                .HasConversion<string>();

            modelBuilder.Entity<Participant>()
                .Property(p => p.Status)
                .HasConversion<string>();

            base.OnModelCreating(modelBuilder);
        }
    }

}
