using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using RecipesNg6.Core.Models;
using RecipesNg6.Core.Models.Dto;
using RecipesNg6.Database;

namespace RecipesNg6.Controllers
{
    [Authorize]
    [Route("api/v1/[controller]")]
    //[ApiController]
    public class RecipeController : Controller
    {
        private readonly RecipeDbContext db;
        private readonly IMapper mapper;
        private readonly ILogger logger;

        public RecipeController(RecipeDbContext db, IMapper mapper, ILogger<RecipeController> logger)
        {
            this.db = db;
            this.mapper = mapper;
            this.logger = logger;
        }

        [AllowAnonymous]
        [HttpGet]
        public IEnumerable<RecipeDto> GetAll()
        {
            return db.Recipes
                .Include(r => r.Ingredients)
                .ThenInclude(map => map.Ingredient)
                .ProjectTo<RecipeDto>(mapper.ConfigurationProvider);
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<ActionResult<RecipeDto>> GetById(int id, CancellationToken cancellation)
        {
            try
            {
                var recipe = await db.Recipes
                   .Include(r => r.Ingredients)
                   .ThenInclude(map => map.Ingredient)
                   .FirstAsync(r => r.Id == id, cancellation);

                if (recipe == null)
                    return NotFound();

                cancellation.ThrowIfCancellationRequested();

                var dto = mapper.Map<RecipeDto>(recipe);

                return Ok(dto);

            }
            catch (OperationCanceledException)
            {
                logger.LogInformation($"{nameof(RecipeController)}::{nameof(GetById)} got cancelled");
                throw;
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRecipe([FromRoute] int id, [FromBody] CreateUpdateRecipeDto receivedRecipe, CancellationToken cancellation)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var recipe = await db.Recipes
                    .Include(r => r.Ingredients)
                    .ThenInclude(i => i.Ingredient)
                    .FirstAsync(r => r.Id == id, cancellation);

                if (recipe == null)
                    return NotFound();

                cancellation.ThrowIfCancellationRequested();

                mapper.Map(receivedRecipe, recipe);

                var ingredientNames = receivedRecipe.Ingredients.Select(i => i.Name).ToArray();

                cancellation.ThrowIfCancellationRequested();

                await db.Ingredients.Where(i => ingredientNames.Contains(i.Name))
                    .AsNoTracking()
                    .ForEachAsync(i =>
                    {
                        // Set the id of each mapped ingredient to the one from the db
                        var map = recipe.Ingredients.First(_ => _.Ingredient.Name == i.Name);
                        map.IngredientId = i.Id;

                    }, cancellation);

                await db.SaveChangesAsync(cancellation);

                return NoContent();
            }
            catch (OperationCanceledException)
            {
                logger.LogInformation($"{nameof(RecipeController)}::{nameof(UpdateRecipe)} got cancelled");
                throw;
            }
        }

        [HttpPost]
        public async Task<IActionResult> AddRecipe([FromBody] CreateUpdateRecipeDto receivedRecipe, CancellationToken cancellation)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (await db.Recipes.AnyAsync(r => r.Name == receivedRecipe.Name, cancellation))
                    return BadRequest("already exists");

                cancellation.ThrowIfCancellationRequested();

                var recipe = mapper.Map<Recipe>(receivedRecipe);

                recipe.DateCreated = DateTime.Now;

                db.Recipes.Add(recipe);

                var ingredientNames = receivedRecipe.Ingredients.Select(i => i.Name).ToArray();

                cancellation.ThrowIfCancellationRequested();

                await db.Ingredients.Where(i => ingredientNames.Contains(i.Name))
                    .AsNoTracking()
                    .ForEachAsync(i =>
                    {
                        // Set the id of each mapped ingredient to the one from the db
                        recipe.Ingredients.Select(map => map.Ingredient).First(_ => _.Name == i.Name).Id = i.Id;
                    }, cancellation);

                await db.SaveChangesAsync(cancellation);

                cancellation.ThrowIfCancellationRequested();

                return CreatedAtAction(nameof(GetById), new { id = recipe.Id }, mapper.Map<RecipeDto>(recipe));
            }
            catch (OperationCanceledException)
            {
                logger.LogInformation($"{nameof(RecipeController)}::{nameof(AddRecipe)} got cancelled");
                throw;
            }
        }
    }
}
