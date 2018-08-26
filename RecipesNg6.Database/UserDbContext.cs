using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using RecipesNg6.Core.Models.Users;

namespace RecipesNg6.Database
{
    public class UserDbContext : IdentityDbContext<RecipeUser, RecipeRole, Guid>
    {
        public UserDbContext(DbContextOptions<UserDbContext> options) : base(options) { }
    }
}
