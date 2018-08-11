using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using RecipesNg6.Core.Models;
using RecipesNg6.Core.Models.Dto;
using RecipesNg6.Database;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace RecipesNg6.Controllers
{
    [Route("api/v1/[controller]")]
    public class IngredientController : Controller
    {
        private readonly RecipeDbContext db;
        private readonly IMapper mapper;
        private readonly ILogger logger;

        public IngredientController(RecipeDbContext db, IMapper mapper, ILogger<IngredientController> logger)
        {
            this.db = db;
            this.mapper = mapper;
            this.logger = logger;
        }

        [HttpGet]
        public IEnumerable<IngredientListItemDto> GetAll()
        {
            return db.Ingredients
                .ProjectTo<IngredientListItemDto>(mapper.ConfigurationProvider);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<IngredientListItemDto>> GetById(int id, CancellationToken cancellation)
        {
            try
            {
                var recipe = await db.Ingredients
                    .FirstAsync(r => r.Id == id);

                if (recipe == null)
                    return NotFound();

                cancellation.ThrowIfCancellationRequested();

                var dto = mapper.Map<IngredientListItemDto>(recipe);

                return Ok(dto);
            }
            catch (OperationCanceledException)
            {
                logger.LogInformation($"{nameof(IngredientController)}::{nameof(GetById)} got cancelled");
                throw;
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRecipe([FromRoute] int id, [FromBody] CreateUpdateIngredientDto receivedIngredient, CancellationToken cancellation)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var ingredient = await db.Ingredients.FindAsync(id);

                if (ingredient == null)
                    return NotFound();

                cancellation.ThrowIfCancellationRequested();

                mapper.Map(receivedIngredient, ingredient);

                var x = await db.SaveChangesAsync();

                return NoContent();
            }
            catch (OperationCanceledException)
            {
                logger.LogInformation($"{nameof(IngredientController)}::{nameof(UpdateRecipe)} got cancelled");
                throw;
            }
        }

        [HttpPost]
        public async Task<IActionResult> AddIngredient([FromBody] CreateUpdateIngredientDto receivedIngredient, CancellationToken cancellation)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (await db.Ingredients.AnyAsync(r => r.Name == receivedIngredient.Name))
                    return BadRequest("already exists");

                cancellation.ThrowIfCancellationRequested();

                var ingredient = mapper.Map<Ingredient>(receivedIngredient);

                db.Ingredients.Add(ingredient);

                await db.SaveChangesAsync();

                return CreatedAtAction(nameof(GetById), new { id = ingredient.Id }, ingredient);
            }
            catch (OperationCanceledException)
            {
                logger.LogInformation($"{nameof(IngredientController)}::{nameof(AddIngredient)} got cancelled");
                throw;
            }
        }
    }
}
