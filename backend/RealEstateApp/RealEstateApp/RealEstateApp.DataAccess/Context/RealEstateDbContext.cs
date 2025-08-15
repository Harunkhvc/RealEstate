using Microsoft.EntityFrameworkCore;
using RealEstateApp.Core.Entities;

namespace RealEstateApp.DataAccess.Context
{
    public class RealEstateDbContext : DbContext
    {
        public RealEstateDbContext(DbContextOptions<RealEstateDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<PropertyType> PropertyTypes { get; set; }
        public DbSet<PropertyStatus> PropertyStatuses { get; set; }
        public DbSet<Currency> Currencies { get; set; }
        public DbSet<Property> Properties { get; set; }
        public DbSet<PropertyPhoto> PropertyPhotos { get; set; }
        public DbSet<Language> Languages { get; set; } = null!;
        public DbSet<Favorite> Favorites { get; set; } = null!; // << eklendi

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // PropertyPhoto -> Property (1-n), cascade delete
            modelBuilder.Entity<PropertyPhoto>()
                .HasOne(pp => pp.Property)
                .WithMany(p => p.Photos)
                .HasForeignKey(pp => pp.PropertyId)
                .OnDelete(DeleteBehavior.Cascade);

            // Property.Price precision
            modelBuilder.Entity<Property>()
                .Property(p => p.Price)
                .HasColumnType("decimal(18,2)");

            // Favorite konfigürasyonu
            // Kullanıcı + Emlak kombinasyonu benzersizdir.
            modelBuilder.Entity<Favorite>(b =>
            {
                b.HasIndex(x => new { x.UserId, x.PropertyId }).IsUnique();

                b.HasOne(x => x.User)
                    .WithMany() // istersen User tarafında ICollection<Favorite> tanımlayıp .WithMany(u => u.Favorites) yapabilirsin
                    .HasForeignKey(x => x.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                b.HasOne(x => x.Property)
                    .WithMany() // istersen Property tarafında ICollection<Favorite> tanımlayıp .WithMany(p => p.Favorites) yapabilirsin
                    .HasForeignKey(x => x.PropertyId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Seed: PropertyType
            modelBuilder.Entity<PropertyType>().HasData(
                new PropertyType { Id = 1, Name = "Daire" },
                new PropertyType { Id = 2, Name = "Villa" },
                new PropertyType { Id = 3, Name = "Arsa" }
            );

            // Seed: PropertyStatus
            modelBuilder.Entity<PropertyStatus>().HasData(
                new PropertyStatus { Id = 1, Name = "Satılık" },
                new PropertyStatus { Id = 2, Name = "Kiralık" }
            );

            // Seed: Currency
            modelBuilder.Entity<Currency>().HasData(
                new Currency { Id = 1, Code = "TRY", Symbol = "₺" },
                new Currency { Id = 2, Code = "USD", Symbol = "$" },
                new Currency { Id = 3, Code = "EUR", Symbol = "€" }
            );

            // Seed: Users
            modelBuilder.Entity<User>().HasData(
                new User { Id = 1, Username = "admin", Password = "admin123", Role = "Admin" },
                new User { Id = 2, Username = "user", Password = "user123", Role = "User" }
            );
        }
    }
}
