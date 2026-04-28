using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Api366Fit.Models;
using Api366Fit.Data;

namespace Api366Fit.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClasesController : ControllerBase
    {
        private readonly DataContext _context;

        public ClasesController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetClases()
        {
            try
            {
                var clases = await _context.Clases
                    .Where(c => c.FechaHora >= DateTime.Now)
                    .OrderBy(c => c.FechaHora)
                    .ToListAsync();
                return Ok(clases);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error interno del servidor: " + ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> PostClase([FromBody] Clase nuevaClase)
        {
            try
            {
                _context.Clases.Add(nuevaClase);
                await _context.SaveChangesAsync();
                return Ok(nuevaClase);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error al crear la clase: " + ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClase(int id)
        {
            try
            {
                var clase = await _context.Clases.FindAsync(id);
                if (clase == null) return NotFound("La clase no existe.");

                _context.Clases.Remove(clase);
                await _context.SaveChangesAsync();

                return Ok(new { mensaje = "Clase eliminada correctamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error al eliminar: " + ex.Message);
            }
        }
    }
}