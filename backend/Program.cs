using Microsoft.EntityFrameworkCore;
using PlanningPoker.Persistence;
using PlanningPoker.Services.RoomService;

namespace PlanningPoker
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddCors(options =>
            {
                options.AddPolicy(name: MyAllowSpecificOrigins,
                    policy =>
                    {
                        policy.WithOrigins("http://localhost:3000/");
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

            app.UseCors(MyAllowSpecificOrigins);
            app.UseAuthorization();


            app.MapControllers();

            //app.MapHub<RoomHub>("/roomHub");

            app.Run();
        }
    }
}
