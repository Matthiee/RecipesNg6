using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using RecipesNg6.Database;

namespace RecipesNg6
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var host = CreateWebHostBuilder(args).Build();

            using (var scope = host.Services.CreateScope())
            {
                var svcs = scope.ServiceProvider;

                var loggerFactory = svcs.GetRequiredService<ILoggerFactory>();

                using (var recipeDb = svcs.GetRequiredService<RecipeDbContext>())
                {
                    recipeDb.Database.Migrate();

                    var logger = loggerFactory.CreateLogger<Program>();

                    logger.LogInformation("Migration completed");
                }
            }

            host.Run();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseUrls("http://0.0.0.0:5000")
                .UseStartup<Startup>();
    }
}
