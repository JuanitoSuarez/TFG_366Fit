using Microsoft.AspNetCore.Mvc;
using Api366Fit.Data;
using Api366Fit.Models;
using Api366Fit.DTOs;

namespace Api366Fit.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly DataContext _context;

        public AuthController(DataContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public IActionResult Register(RegisterDto request)
        {
            if (string.IsNullOrEmpty(request.plan))
            {
                return BadRequest("Debes seleccionar un plan.");
            }

            var planesValidos = new List<string> { "366Fit Basic", "366Fit Plus", "366Fit Premium" };

            if (!planesValidos.Contains(request.plan))
            {
                return BadRequest($"El plan '{request.plan}' no es válido.");
            }

            if (_context.Usuarios.Any(u => u.email == request.email))
            {
                return BadRequest("El email ya está registrado.");
            }

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.password);

            var nuevoUsuario = new Usuario
            {
                nombre_completo = request.nombre_completo,
                email = request.email,
                password_hash = passwordHash,
                rol = "cliente",
                plan = request.plan
            };

            _context.Usuarios.Add(nuevoUsuario);
            _context.SaveChanges();

            return Ok(new { mensaje = "¡Usuario registrado con éxito!" });
        }

        [HttpPost("login")]
        public IActionResult Login(LoginDto request)
        {
            var usuario = _context.Usuarios.FirstOrDefault(u => u.email == request.email);

            if (usuario == null)
            {
                return BadRequest("El usuario no existe en 366Fit.");
            }

            bool passwordValida = BCrypt.Net.BCrypt.Verify(request.password, usuario.password_hash);

            if (!passwordValida)
            {
                return BadRequest("Contraseña incorrecta.");
            }

            return Ok(new
            {
                mensaje = $"¡Bienvenido de nuevo, {usuario.nombre_completo}!",
                email = usuario.email,
                rol = usuario.rol,
                nombre = usuario.nombre_completo,
                plan = usuario.plan
            });
        }
    }
}