using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

        public IngredientController(RecipeDbContext db, IMapper mapper)
        {
            this.db = db;
            this.mapper = mapper;
        }

        [HttpGet]
        public IEnumerable<IngredientDto> GetAll()
        {
            return db.Ingredients
                .ProjectTo<IngredientDto>(mapper.ConfigurationProvider);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<IngredientDto>> GetById(int id)
        {
            var recipe = await db.Ingredients
                .FirstAsync(r => r.Id == id);

            if (recipe == null)
                return NotFound();

            var dto = mapper.Map<IngredientDto>(recipe);

            return Ok(dto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRecipe([FromRoute] int id, [FromBody] CreateUpdateIngredientDto receivedIngredient)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var ingredient = await db.Ingredients.FindAsync(id);

            if (ingredient == null)
                return NotFound();

            mapper.Map(receivedIngredient, ingredient);

            var x = await db.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost]
        public async Task<IActionResult> AddIngredient([FromBody] CreateUpdateIngredientDto receivedIngredient)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (await db.Ingredients.AnyAsync(r => r.Name == receivedIngredient.Name))
                return BadRequest("already exists");

            var ingredient = mapper.Map<Ingredient>(receivedIngredient);

            db.Ingredients.Add(ingredient);

            await db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = ingredient.Id }, ingredient);
        }
    }
}
