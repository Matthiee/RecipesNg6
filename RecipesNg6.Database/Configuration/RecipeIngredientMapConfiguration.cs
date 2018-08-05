using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RecipesNg6.Core.Models;

namespace RecipesNg6.Database.Configuration
{
    public class RecipeIngredientMapConfiguration : IEntityTypeConfiguration<RecipeIngredientMap>
    {
        public void Configure(EntityTypeBuilder<RecipeIngredientMap> builder)
        {
            builder.HasKey(map => new { map.RecipeId, map.IngredientId });
        }
    }
}
