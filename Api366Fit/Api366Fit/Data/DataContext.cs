using Api366Fit.Models;
using Microsoft.EntityFrameworkCore;

namespace Api366Fit.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }

        // Aquí meteremos nuestras tablas (usuarios, clases, monitores, reservas, etc)
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Clase> Clases { get; set; }
        public DbSet<Reserva> Reservas { get; set; }
    }
}