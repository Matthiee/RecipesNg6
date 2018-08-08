using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecipesNg6.Core.Models;
using RecipesNg6.Core.Models.Dto;
using RecipesNg6.Database;

namespace RecipesNg6.Controllers
{
    [Route("api/[controller]")]
    public class RecipeController : Controller
    {
        private readonly RecipeDbContext db;
        private readonly IMapper mapper;

        public RecipeController(RecipeDbContext db, IMapper mapper)
        {
            this.db = db;
            this.mapper = mapper;
        }

        [HttpGet]
        public IEnumerable<RecipeDto> GetAll()
        {
            return db.Recipes
                .Include(r => r.Ingredients)
                .ThenInclude(map => map.Ingredient)
                .ProjectTo<RecipeDto>(mapper.ConfigurationProvider);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<RecipeDto>> GetById(int id)
        {
            var recipe = await db.Recipes
                .Include(r => r.Ingredients)
                .ThenInclude(map => map.Ingredient)
                .FirstAsync(r => r.Id == id);

            if (recipe == null)
                return NotFound();

            var dto = mapper.Map<RecipeDto>(recipe);

            return Ok(dto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRecipe([FromRoute] int id, [FromBody] CreateUpdateRecipeDto receivedRecipe)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var recipe = await db.Recipes.FindAsync(id);

            if (recipe == null)
                return NotFound();

            mapper.Map(receivedRecipe, recipe);

            var x = await db.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost]
        public async Task<IActionResult> AddRecipe([FromBody] CreateUpdateRecipeDto receivedRecipe)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (await db.Recipes.AnyAsync(r => r.Name == receivedRecipe.Name))
                return BadRequest("already exists");

            var recipe = mapper.Map<Recipe>(receivedRecipe);

            recipe.DateCreated = DateTime.Now;

            db.Recipes.Add(recipe);

            await db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = recipe.Id }, recipe);
        }
    }
}
