using System;
using System.Collections.Generic;
using System.Text;

namespace RecipesNg6.Core.Models
{
    public class Recipe
    {

        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime DateCreated { get; set; }
        public string ImagePath { get; set; }
        public string Description { get; set; }

        public ICollection<RecipeIngredientMap> Ingredients { get; set; } = new List<RecipeIngredientMap>();
    }
}
