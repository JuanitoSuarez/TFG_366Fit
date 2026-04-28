using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Api366Fit.Data;
using Api366Fit.Models;

namespace Api366Fit.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReservasController : ControllerBase
    {
        private readonly DataContext _context;

        public ReservasController(DataContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> HacerReserva([FromBody] NuevaReservaDto dto)
        {
            // Normalizamos el email para evitar errores de mayúsculas o espacios
            string emailNormalizado = dto.UsuarioEmail.Trim().ToLower();

            // Buscamos la clase en la base de datos
            var clase = await _context.Clases.FindAsync(dto.ClaseId);

            if (clase == null)
            {
                return NotFound(new { mensaje = "La clase seleccionada no existe." });
            }

            // --- VALIDACIÓN DE TIEMPO ---
            // Se comprueba que la clase no haya empezado o terminado ya
            if (clase.FechaHora < DateTime.Now)
            {
                return BadRequest(new { mensaje = "No puedes reservar una clase que ya ha comenzado o ha finalizado." });
            }

            // Se comprueba si queda hueco
            if (clase.PlazasOcupadas >= clase.AforoMaximo)
            {
                return BadRequest(new { mensaje = "Lo sentimos, la clase está completamente llena." });
            }

            // Se evita que el mismo usuario se apunte dos veces (normalizando la búsqueda)
            var yaReservado = await _context.Reservas
                .AnyAsync(r => r.ClaseId == dto.ClaseId && r.UsuarioEmail.ToLower() == emailNormalizado);

            if (yaReservado)
            {
                return BadRequest(new { mensaje = "Ya tienes una plaza reservada para esta clase." });
            }

            // Creamos el ticket de reserva
            var nuevaReserva = new Reserva
            {
                UsuarioEmail = emailNormalizado,
                ClaseId = dto.ClaseId,
                FechaReserva = DateTime.Now
            };

            _context.Reservas.Add(nuevaReserva);

            // Se sumará 1 a las plazas ocupadas de la clase
            clase.PlazasOcupadas++;

            // Guardamos todos los cambios en MySQL
            await _context.SaveChangesAsync();

            return Ok(new
            {
                mensaje = "¡Reserva confirmada con éxito!",
                plazasLibres = clase.AforoMaximo - clase.PlazasOcupadas
            });
        }

        // Nueva ruta mejorada para evitar conflictos con el ".com" del email
        [HttpGet("mis-reservas")]
        public async Task<IActionResult> GetMisReservas([FromQuery] string email)
        {
            if (string.IsNullOrEmpty(email)) return BadRequest();

            string emailBusqueda = email.Trim().ToLower();

            // Buscamos las reservas del usuario y las juntamos con la tabla clases
            var misReservas = await _context.Reservas
                .Where(r => r.UsuarioEmail.ToLower() == emailBusqueda)
                .Join(_context.Clases,
                    reserva => reserva.ClaseId,
                    clase => clase.Id,
                    (reserva, clase) => new {
                        reservaId = reserva.Id,
                        claseNombre = clase.Nombre,
                        monitor = clase.Monitor,
                        fechaHora = clase.FechaHora
                    })
                .ToListAsync();

            return Ok(misReservas);
        }

        // Método para cancelar reservas
        [HttpDelete("{id}")]
        public async Task<IActionResult> CancelarReserva(int id)
        {
            // Buscamos la reserva por su ID
            var reserva = await _context.Reservas.FindAsync(id);
            if (reserva == null)
            {
                return NotFound(new { mensaje = "La reserva no existe." });
            }

            // Buscamos la clase asociada para devolver la plaza libre
            var clase = await _context.Clases.FindAsync(reserva.ClaseId);
            if (clase != null && clase.PlazasOcupadas > 0)
            {
                clase.PlazasOcupadas--;
            }

            // Destruimos el ticket de reserva de la base de datos
            _context.Reservas.Remove(reserva);

            // Guardamos los cambios
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Reserva cancelada correctamente. ¡Plaza liberada!" });
        }
    }

    public class NuevaReservaDto
    {
        public int ClaseId { get; set; }
        public string UsuarioEmail { get; set; } = string.Empty;
    }
}