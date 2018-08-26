using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace RecipesNg6.Core.Models.Dto
{
    public class IngredientDto
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public int? Amount { get; set; }
    }
}
