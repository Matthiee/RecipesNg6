using System;
using System.Collections.Generic;
using System.Text;

namespace RecipesNg6.Core.Models.Users.Dto
{
    public class JwtResponseData
    {
        public long Expires { get; set; }
        public string Token { get; set; }
    }
}
