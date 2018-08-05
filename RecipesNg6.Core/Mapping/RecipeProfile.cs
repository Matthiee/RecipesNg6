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
            CreateMap<Recipe, RecipeDto>()
                .ForMember(r => r.DateCreated, opt => opt.AllowNull());

            CreateMap<RecipeDto, Recipe>()
                .ForMember(r => r.Id, opt => opt.Ignore())
                .ForMember(r => r.DateCreated, opt => opt.AllowNull());
        }


    }
}
