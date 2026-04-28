using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Api366Fit.Models
{
    [Table("clases")]
    public class Clase
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("nombre")]
        public string Nombre { get; set; } = string.Empty;

        [Required]
        [Column("monitor")]
        public string Monitor { get; set; } = string.Empty;

        [Required]
        [Column("fecha_hora")]
        public DateTime FechaHora { get; set; }

        [Required]
        [Column("aforo_maximo")]
        public int AforoMaximo { get; set; }

        [Column("plazas_ocupadas")]
        public int PlazasOcupadas { get; set; } = 0;
    }
}