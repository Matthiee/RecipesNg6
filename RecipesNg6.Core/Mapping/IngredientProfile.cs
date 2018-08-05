using System;
using System.Collections.Generic;
using System.Text;
using AutoMapper;
using RecipesNg6.Core.Models;
using RecipesNg6.Core.Models.Dto;

namespace RecipesNg6.Core.Mapping
{
    public class IngredientProfile : Profile
    {

        public IngredientProfile()
        {
            CreateMap<Ingredient, IngredientDto>();

            CreateMap<IngredientDto, Ingredient>()
                .ForMember(i => i.Id, opt => opt.Ignore());
        }

    }
}
