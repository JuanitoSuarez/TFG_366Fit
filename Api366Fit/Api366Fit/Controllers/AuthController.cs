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

        // Inyectamos la base de datos en el controlador
        public AuthController(DataContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public IActionResult Register(RegisterDto request)
        {
            // Comprobamos si el email ya existe en la base de datos
            if (_context.Usuarios.Any(u => u.email == request.email))
            {
                return BadRequest("El email ya está registrado en 366Fit.");
            }

            // Se encripta la contraseña usando la librería BCrypt que instalamos
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.password);

            // Crear el nuevo usuario usando nuestro modelo
            var nuevoUsuario = new Usuario
            {
                nombre_completo = request.nombre_completo,
                email = request.email,
                password_hash = passwordHash,
                // Todo el que se registra por primera vez es cliente
                rol = "cliente"
            };

            // Se guarda en la base de datos
            _context.Usuarios.Add(nuevoUsuario);
            _context.SaveChanges();

            return Ok("¡Usuario registrado con éxito!");
        }

        [HttpPost("login")]
        public IActionResult Login(LoginDto request)
        {
            // Se busca si existe un usuario con ese email en la BBDD
            var usuario = _context.Usuarios.FirstOrDefault(u => u.email == request.email);

            if (usuario == null)
            {
                return BadRequest("El usuario no existe en 366Fit.");
            }

            // Comparamos la contraseña que ha escrito con la encriptada
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
                nombre = usuario.nombre_completo
            });
        }
    }
}