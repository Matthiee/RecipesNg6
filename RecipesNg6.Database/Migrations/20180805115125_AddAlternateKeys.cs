using Microsoft.EntityFrameworkCore.Migrations;

namespace RecipesNg6.Database.Migrations
{
    public partial class AddAlternateKeys : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Recipes",
                nullable: false,
                oldClrType: typeof(string));

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Ingredients",
                nullable: false,
                oldClrType: typeof(string));

            migrationBuilder.AddUniqueConstraint(
                name: "AK_Name",
                table: "Recipes",
                column: "Name");

            migrationBuilder.AddUniqueConstraint(
                name: "AK_Name",
                table: "Ingredients",
                column: "Name");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropUniqueConstraint(
                name: "AK_Name",
                table: "Recipes");

            migrationBuilder.DropUniqueConstraint(
                name: "AK_Name",
                table: "Ingredients");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Recipes",
                nullable: false,
                oldClrType: typeof(string));

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Ingredients",
                nullable: false,
                oldClrType: typeof(string));
        }
    }
}
