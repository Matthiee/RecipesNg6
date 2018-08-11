using System;
using System.Collections.Generic;
using System.Text;
using AutoMapper;
using RecipesNg6.Core.Models;
using RecipesNg6.Core.Models.Dto;

namespace RecipesNg6.Core.Mapping
{
    public class RecipeProfile : Profile
    {
        public RecipeProfile()
        {
            CreateMap<CreateUpdateRecipeDto, Recipe>()
                .ForMember(r => r.Id, opt => opt.Ignore())
                .ForMember(r => r.DateCreated, opt => opt.Ignore());

            CreateMap<Recipe, RecipeDto>()
                .ForMember(r => r.DateCreated, opt => opt.AllowNull())
                .ForMember(r => r.Ingredients, opt => opt.MapFrom(x => x.Ingredients));

            CreateMap<RecipeIngredientMap, RecipeDto>()
                .ForAllMembers(opt => opt.MapFrom(map => map.Recipe));
        }


    }
}
