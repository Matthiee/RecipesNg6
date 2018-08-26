using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using RecipesNg6.Core.Models.Users;
using RecipesNg6.Core.Models.Users.Dto;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace RecipesNg6.Controllers.v1
{
    [AllowAnonymous]
    [Route("api/v1/[controller]/[Action]")]
    [ApiController]
    public class AccountController : Controller
    {

        private readonly UserManager<RecipeUser> userManager;
        private readonly SignInManager<RecipeUser> signInManager;
        private readonly ILogger logger;
        private readonly IConfiguration configuration;

        public AccountController(UserManager<RecipeUser> userManager, SignInManager<RecipeUser> signInManager, ILogger<AccountController> logger, IConfiguration configuration)
        {
            this.userManager = userManager ?? throw new ArgumentNullException(nameof(userManager));
            this.signInManager = signInManager ?? throw new ArgumentNullException(nameof(signInManager));
            this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
            this.configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginDto login)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var user = await userManager.FindByEmailAsync(login.Email);

            if (user == null)
                return BadRequest("Woops!! Something went wrong!"); // we do not want to disclose that the 'email' is registered..

            var result = await signInManager.CheckPasswordSignInAsync(user, login.Password, false);

            if (!result.Succeeded) return Unauthorized();

            return Ok(GenerateJwtToken(login.Email, user));
        }

        [HttpPost]
        public async Task<IActionResult> Register([FromBody] RegisterDto register)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (userManager.Users.Any(db => db.Email == register.Email || db.UserName == register.Email))
                return BadRequest("Woops!! Something went wrong!"); // we do not want to disclose that the 'email' is registered..

            var user = new RecipeUser
            {
                Email = register.Email,
                UserName = register.Email
            };

            var result = await userManager.CreateAsync(user, register.Password);

            if (!result.Succeeded) return BadRequest(result.Errors);

            await signInManager.SignInAsync(user, false);

            return Ok(GenerateJwtToken(register.Email, user));
        }

        private JwtResponseData GenerateJwtToken(string email, RecipeUser user)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Auth:IssuerSigninKey"]));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);
            var expires = DateTime.Now.AddMinutes(5);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: expires,
                signingCredentials: credentials
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            return new JwtResponseData
            {
                Expires = 5,
                Token = tokenString
            };
        }
    }
}
