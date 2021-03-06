﻿using System;
using System.Collections.Generic;
using System.Text;

namespace RecipesNg6.Core.Models
{
    public class RecipeIngredientMap
    {

        public int RecipeId { get; set; }
        public Recipe Recipe { get; set; }

        public int IngredientId { get; set; }
        public Ingredient Ingredient { get; set; }

        public int? Amount { get; set; }
    }
}
