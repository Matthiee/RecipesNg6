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
            CreateMap<CreateUpdateIngredientDto, Ingredient>()
                .ForMember(i => i.Id, opt => opt.Ignore());

            CreateMap<Ingredient, IngredientDto>()
                .ForMember(i => i.Amount, opt => opt.Ignore());

            CreateMap<RecipeIngredientMap, IngredientDto>()
                .ForMember(i => i.Name, opt => opt.ResolveUsing(map => map.Ingredient.Name))
                .ForMember(i => i.Id, opt => opt.ResolveUsing(map => map.IngredientId));
        }

    }
}
