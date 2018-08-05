using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RecipesNg6.Core.Models;

namespace RecipesNg6.Database.Configuration
{
    internal class IngredientConfiguration : IEntityTypeConfiguration<Ingredient>
    {
        public void Configure(EntityTypeBuilder<Ingredient> builder)
        {
            builder.Property(i => i.Name).IsRequired();
            builder.HasAlternateKey(i => i.Name).HasName("AK_Name");

            builder.Property(i => i.Amount).IsRequired();

            builder.HasMany(i => i.Recipes).WithOne(map => map.Ingredient).HasForeignKey(map => map.IngredientId);
        }
    }
}
