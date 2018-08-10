using Microsoft.EntityFrameworkCore.Migrations;

namespace RecipesNg6.Database.Migrations
{
    public partial class RemoveManyToMany : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Amount",
                table: "Ingredients");

            migrationBuilder.AddColumn<int>(
                name: "Amount",
                table: "RecipeIngredientMap",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Amount",
                table: "RecipeIngredientMap");

            migrationBuilder.AddColumn<int>(
                name: "Amount",
                table: "Ingredients",
                nullable: false,
                defaultValue: 0);
        }
    }
}
