using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RealEstateApp.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddPropertyDetailFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "BuildingAge",
                table: "Properties",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Floor",
                table: "Properties",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "M2Brut",
                table: "Properties",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "M2Net",
                table: "Properties",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RoomCount",
                table: "Properties",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BuildingAge",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "Floor",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "M2Brut",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "M2Net",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "RoomCount",
                table: "Properties");
        }
    }
}
