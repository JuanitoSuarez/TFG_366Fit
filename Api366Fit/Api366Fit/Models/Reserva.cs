using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Api366Fit.Models
{
    [Table("reservas")]
    public class Reserva
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("usuario_email")]
        public string UsuarioEmail { get; set; } = string.Empty;

        [Required]
        [Column("clase_id")]
        public int ClaseId { get; set; }

        [Column("fecha_reserva")]
        public DateTime FechaReserva { get; set; } = DateTime.Now;
    }
}