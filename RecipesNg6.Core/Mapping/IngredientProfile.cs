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
            CreateMap<IngredientDto, RecipeIngredientMap>()
                .ForMember(i => i.IngredientId, opt => opt.Ignore())
                .ForMember(i => i.RecipeId, opt => opt.Ignore())
                .ForMember(i => i.Recipe, opt => opt.Ignore())
                .ForMember(i => i.Ingredient, opt => opt.MapFrom(_ => _));

            CreateMap<CreateUpdateIngredientDto, RecipeIngredientMap>()
                .ForMember(i => i.IngredientId, opt => opt.Ignore())
                .ForMember(i => i.RecipeId, opt => opt.Ignore())
                .ForMember(i => i.Recipe, opt => opt.Ignore())
                .ForMember(i => i.Ingredient, opt => opt.MapFrom(_ => _));

            CreateMap<Ingredient, IngredientDto>()
                .ForMember(i => i.Amount, opt => opt.Ignore());

            CreateMap<Ingredient, IngredientDto>();

            CreateMap<RecipeIngredientMap, IngredientDto>()
                .ForMember(i => i.Name, opt => opt.MapFrom(map => map.Ingredient.Name))
                .ForMember(i => i.Id, opt => opt.MapFrom(map => map.IngredientId));
        }

    }
}
