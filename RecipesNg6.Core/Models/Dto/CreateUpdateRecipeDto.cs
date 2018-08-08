using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace RecipesNg6.Core.Models.Dto
{
    public class CreateUpdateRecipeDto
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public string Description { get; set; }

        [Required, Url]
        public string ImagePath { get; set; }

        public IReadOnlyCollection<IngredientDto> Ingredients { get; set; }
    }
}
