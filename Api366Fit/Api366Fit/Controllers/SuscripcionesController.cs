using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Api366Fit.Data;
using Api366Fit.Models;

namespace Api366Fit.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SuscripcionesController : ControllerBase
    {
        private readonly DataContext _context;

        public SuscripcionesController(DataContext context)
        {
            _context = context;
        }

        // Obtenemos el plan actual del socio

        [HttpGet("plan")]
        public async Task<IActionResult> GetPlan([FromQuery] string email)
        {
            if (string.IsNullOrEmpty(email)) return BadRequest();

            string emailBusqueda = email.Trim().ToLower();

            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.email.ToLower() == emailBusqueda);

            if (usuario == null)
            {
                return NotFound(new { mensaje = "Usuario no encontrado" });
            }

            return Ok(new { plan = usuario.plan });
        }

        // Actualizamos la suscripción cuando el socio decide cambiarla

        [HttpPut("actualizar")]
        public async Task<IActionResult> ActualizarPlan([FromBody] ActualizarPlanDto dto)
        {
            string emailBusqueda = dto.Email.Trim().ToLower();

            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.email.ToLower() == emailBusqueda);

            if (usuario == null)
            {
                return NotFound(new { mensaje = "No se pudo encontrar el usuario para actualizar el plan." });
            }

            // Actualizamos el campo plan
            usuario.plan = dto.NuevoPlan;

            // Guardamos cambios en la base de datos
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = $"¡Plan actualizado a {dto.NuevoPlan} correctamente!" });
        }
    }

    public class ActualizarPlanDto
    {
        public string Email { get; set; } = string.Empty;
        public string NuevoPlan { get; set; } = string.Empty;
    }
}