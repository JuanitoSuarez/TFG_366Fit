using System.ComponentModel.DataAnnotations;

namespace Api366Fit.Models
{
    public class Usuario
    {
        [Key]
        public int id_usuario { get; set; }

        [Required]
        public string nombre_completo { get; set; }

        [Required]
        public string email { get; set; }

        [Required]
        public string password_hash { get; set; }

        public string rol { get; set; } = "cliente";

        public string plan { get; set; } = "366Fit Basic";
    }
}