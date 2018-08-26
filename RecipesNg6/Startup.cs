using System;
using System.Linq;
using System.Reflection;
using System.Text;
using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using RecipesNg6.Core.Mapping;
using RecipesNg6.Core.Models.Users;
using RecipesNg6.Database;

namespace RecipesNg6
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<RecipeDbContext>(options =>
            {
                options.UseSqlServer(Configuration["Databases:Recipes:ConnectionString"],
                    sqlOptions => sqlOptions.EnableRetryOnFailure().MigrationsAssembly("RecipesNg6.Database"));
                options.EnableSensitiveDataLogging(Configuration.GetValue<bool>("Databases:Recipes:SensitiveDataLogging"));
            });

            services.AddDbContext<UserDbContext>(options =>
            {
                options.UseSqlServer(Configuration["Databases:Users:ConnectionString"],
                    sqlOptions => sqlOptions.EnableRetryOnFailure().MigrationsAssembly("RecipesNg6.Database"));
                options.EnableSensitiveDataLogging(Configuration.GetValue<bool>("Databases:Users:SensitiveDataLogging"));
            });


            services.AddIdentityCore<RecipeUser>(cfg =>
            {
                cfg.Password.RequiredLength = 8;
                cfg.Password.RequireNonAlphanumeric = false;
                cfg.Password.RequireUppercase = false;
            }).AddEntityFrameworkStores<UserDbContext>()
            .AddRoles<RecipeRole>()
            .AddSignInManager<SignInManager<RecipeUser>>()
            .AddUserManager<UserManager<RecipeUser>>();

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.RequireHttpsMetadata = false;

                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        ValidateIssuer = false,
                        ValidateAudience = false,
                        //ClockSkew = TimeSpan.FromMinutes(Configuration.GetValue<int>("Auth:ClockSkewMinutes")),
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["Auth:IssuerSigninKey"]))
                    };
                });

            //services.AddAuthorization();

            services.AddAutoMapper(typeof(RecipeProfile).Assembly);

            services.AddCors(opt => opt.AddDefaultPolicy(cfg => cfg.AllowAnyOrigin().AllowAnyMethod().AllowCredentials().AllowAnyHeader()));

            services.AddMvc(opt =>
            {
                var policy = new AuthorizationPolicyBuilder()
                        .RequireAuthenticatedUser()
                        .Build();
                opt.Filters.Add(new AuthorizeFilter(policy));
            }).SetCompatibilityVersion(CompatibilityVersion.Version_2_1);

            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });


        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }

            app.UseCors();

            //app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseAuthentication();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501

                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    //spa.UseAngularCliServer(npmScript: "start");
                    spa.UseProxyToSpaDevelopmentServer("http://localhost:4200");
                }
            });
        }
    }
}
