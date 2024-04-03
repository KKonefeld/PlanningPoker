using Microsoft.EntityFrameworkCore;
using PlanningPoker.Persistence;
using PlanningPoker.Services.RoomService;

namespace PlanningPoker
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var myAllowSpecificOrigins = "_myAllowSpecificOrigins";
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddCors(options =>
            {
                options.AddPolicy(name: myAllowSpecificOrigins,
                    policy =>
                    {
                        policy.AllowAnyOrigin();
                        policy.AllowAnyMethod();
                        policy.AllowAnyHeader();
                    });
            });

            // Add services to the container.
            builder.Services.AddScoped<IRoomService, RoomService>();
            builder.Services.AddDbContext<PlanningPokerDbContext>(
                o => o.UseNpgsql(builder.Configuration.GetConnectionString("PlanningPokerDb"))
                );
            builder.Services.AddSignalR();
            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseCors(myAllowSpecificOrigins);
            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
