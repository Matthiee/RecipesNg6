using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace RecipesNg6.Core.Models.Dto
{
    public class CreateUpdateIngredientDto
    {
        [Required]
        public string Name { get; set; }
    }
}
