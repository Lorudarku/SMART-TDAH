const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./dbConfig');

require('dotenv').config(); // Cargar variables de entorno desde .env 

const app = express();

// ===============================
// Cargar la clave secreta JWT desde variables de entorno
// ===============================
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET no está definido en el entorno. Añádelo a tu archivo .env');
}

// ===============================
// Configuración del host y puerto de escucha
// Lee siempre de variables de entorno para alternar entre localhost y red local
// ===============================
const HOST = process.env.HOST || "localhost"; // Cambia HOST en .env para alternar
const PORT = process.env.SERVER_PORT || 5000;

// Lee el origen permitido desde variable de entorno
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';

// Configura CORS para permitir solo el origen del frontend y aceptar preflight y headers comunes
app.use(cors({
  origin: FRONTEND_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(bodyParser.json());

//Funcion para verificar el token
const checkToken = (req, res, next) => { //req: request, res: response, next: next middleware
  try { // Intentar verificar el token
    const authHeader = req.get('Authorization'); // Obtener el encabezado de autorización
    if (!authHeader) { // Si no se proporcionó un token
      return res.status(401).send('Unauthorized'); // Enviar un mensaje de error de no autorizado
    }

    const token = authHeader.split(' ')[1]; // Obtener el token de la cabecera de autorización
    const payload = jwt.verify(token, JWT_SECRET); // Verificar el token con la clave secreta
    req.userId = payload.userId; // Agregar el id del usuario al objeto de solicitud
    next(); // Llamar al siguiente middleware
  } catch (err) { // Manejar errores
    return res.status(403).send('Invalid or expired token'); // Enviar un mensaje de error de token inválido o caducado
  }
};

// Middleware para comprobar si el usuario es admin
const checkAdmin = (req, res, next) => {
  try {
    const authHeader = req.get('Authorization');
    if (!authHeader) return res.status(401).send('Unauthorized');
    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.rol !== 'admin') return res.status(403).send('Forbidden: Admins only');
    req.userId = payload.userId;
    next();
  } catch (err) {
    return res.status(403).send('Invalid or expired token');
  }
};

// ############################################################################################################################
// GET
// ############################################################################################################################

// Ruta de prueba para verificar la conexión a la base de datos
app.get('/test-db', async (req, res) => { 
  try { // Intentar conectarse a la base de datos
    const client = await pool.connect(); // Obtener un cliente de la piscina
    const result = await client.query('SELECT NOW()'); // Ejecutar una consulta de prueba
    client.release(); // Liberar el cliente
    return res.send(result.rows); // Enviar la respuesta
  } catch (err) { // Manejar errores
    console.error(err);
    return res.status(500).send('Error connecting to the database');
  }
});

// Devuelve la lista de alumnos asociados a un profesor logeado con filtros opcionales
app.get('/alumnos/', checkToken, async (req, res) => {
  const idProfesor = req.userId;
  const page = parseInt(req.query.page) || 1; // Página actual
  const pageSize = parseInt(req.query.page_size) || 16; // Tamaño de página
  const filterBy = req.query.filter_by || null; // Campo a filtrar (nombre, apellidos, curso)
  const query = req.query.query || ''; // Valor del filtro
  const offset = (page - 1) * pageSize; // Calcular el desplazamiento

  if (!idProfesor) {
    return res.status(401).send('Unauthorized');
  }

  try {
    const client = await pool.connect();

    let filterCondition = '';
    const filterParams = [idProfesor];

    // Construir la condición de filtro si se proporciona un filtro
    if (filterBy && query) {
      if (!['nombre', 'apellidos', 'curso'].includes(filterBy)) {
        client.release();
        return res.status(400).send('Invalid filter field'); // Validar que el campo de filtro sea válido
      }
      filterCondition = `AND LOWER(alumnos.${filterBy}) LIKE $2`;
      filterParams.push(`%${query.toLowerCase()}%`);
    }

    // Consulta para obtener los alumnos con paginación y filtro
    const result = await client.query(
      `SELECT alumnos.* 
       FROM alumnos 
       JOIN profesor_alumno ON alumnos.id_alumno = profesor_alumno.id_alumno 
       WHERE profesor_alumno.id_profesor = $1
       ${filterCondition}
       LIMIT $${filterParams.length + 1} OFFSET $${filterParams.length + 2}`,
      [...filterParams, pageSize, offset]
    );

    // Consulta para obtener el número total de alumnos (con o sin filtro)
    const totalResult = await client.query(
      `SELECT COUNT(*) AS total 
       FROM alumnos 
       JOIN profesor_alumno ON alumnos.id_alumno = profesor_alumno.id_alumno 
       WHERE profesor_alumno.id_profesor = $1
       ${filterCondition}`,
      filterParams
    );

    client.release();

    const totalAlumnos = parseInt(totalResult.rows[0].total);
    const totalPages = Math.ceil(totalAlumnos / pageSize);

    return res.status(200).json({
      alumnos: result.rows,
      totalPages,
    });
  } catch (err) {
    console.error('Error fetching alumnos:', err.message);
    res.status(500).send('Error fetching alumnos');
  }
});

// Devuelve las estadísticas de un alumno
app.get('/alumnos/:id_alumno', checkToken, async (req, res) => { //req: request, res: response
  const idAlumno = parseInt(req.params.id_alumno, 10); // Asegúrate de que idAlumno sea un número entero
  const idProfesor = req.userId; // Obtener el id del profesor del token JWT

  if (!idProfesor) { // Si no se proporcionó un id de profesor
    return res.status(401).send('Unauthorized'); // Enviar un mensaje de error de no autorizado 
  }

  if (isNaN(idAlumno)) {
    return res.status(400).send('Invalid student ID'); // Valida que idAlumno sea un número válido
  }

  try { // Intentar obtener las estadísticas del alumno
    const client = await pool.connect(); // Obtener un cliente del pool de conexiones
    const result = await client.query( // Ejecutar una consulta para obtener las estadísticas del alumno
      'SELECT alumnos.*, ejercicios.* FROM alumnos LEFT JOIN ejercicios ON alumnos.id_alumno = ejercicios.id_alumno WHERE alumnos.id_alumno = $1',
      [idAlumno]
    );
    client.release(); // Liberar el cliente
    if (result.rows.length === 0) { // Si no se encontraron estadísticas del alumno
      return res.status(404).send('No se encontraron estadísticas'); // Enviar un mensaje de error de no se encontraron estadísticas
    }
    return res.status(200).json(result.rows); // Enviar las estadísticas del alumno en la respuesta
  } catch (err) { // Manejar errores
    console.error(err);
    return res.status(500).send('Error fetching stats');
  }
});

//Devuelve datos del profesor o admin logeado
app.get('/profile', checkToken, async (req, res) => {
  const userId = req.userId;
  let userRole = null;
  // Extraer el rol del token
  try {
    const authHeader = req.get('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
    if (token) {
      const payload = jwt.decode(token);
      userRole = payload.rol;
    }
  } catch (err) {
    return res.status(401).send('Invalid token');
  }

  if (!userId || !userRole) {
    return res.status(401).send('Unauthorized');
  }

  try {
    const client = await pool.connect();
    let result;
    if (userRole === 'admin') {
      result = await client.query('SELECT nombre, apellidos, email FROM admins WHERE id_admin = $1', [userId]);
    } else {
      result = await client.query('SELECT nombre, apellidos, email FROM profesores WHERE id_profesor = $1', [userId]);
    }
    client.release();
    if (result.rows.length === 0) {
      return res.status(404).send('Profile not found');
    }

    res.status(200).json(result.rows[0]); // Enviar los datos del perfil del profesor en la respuesta
  } catch (err) { // Manejar errores
    console.error(err);
    res.status(500).send('Error fetching profile');
  }
});

// GET /profesores (solo admin)
app.get('/profesores', checkAdmin, async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT id_profesor, nombre, apellidos, email, puede_gestionar_alumnos FROM profesores ORDER BY id_profesor');
    client.release();
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching profesores:', err.message);
    return res.status(500).send('Error fetching profesores');
  }
});

// ############################################################################################################################
// POST
// ############################################################################################################################

// Ruta de registro de un nuevo usuario (profesor)
app.post('/signup', async (req, res) => { //req: request, res: response
  const { email, nombre, apellidos, password } = req.body; // Obtener las credenciales del cuerpo de la solicitud
  try {
    const client = await pool.connect(); // Obtener un cliente del pool de conexiones
    // Comprobar si el email ya existe
    const exists = await client.query('SELECT 1 FROM profesores WHERE email = $1', [email]);
    if (exists.rows.length > 0) {
      client.release();
      return res.status(409).json({ error: 'Email already exists' }); // Error específico para frontend
    }
    // Generar hash solo si el email no existe
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await client.query(
      'INSERT INTO profesores (email, nombre, apellidos, password) VALUES ($1, $2, $3, $4) RETURNING id_profesor',
      [email, nombre, apellidos, hashedPassword]
    );
    client.release();
    return res.status(201).json({ userId: result.rows[0].id_profesor });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error registering new user' });
  }
});

// Ruta de login unificada para profesores y admins
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  let client;
  try {
    client = await pool.connect();
    // Buscar primero en profesores
    let result = await client.query('SELECT * FROM profesores WHERE email = $1', [email]);
    if (result.rows.length > 0) {
      const profesor = result.rows[0];
      if (await bcrypt.compare(password, profesor.password)) {
        const token = jwt.sign({ userId: profesor.id_profesor, rol: 'profesor' }, JWT_SECRET, { expiresIn: '1h' });
        client.release();
        return res.status(200).json({ token, rol: 'profesor', nombre: profesor.nombre, apellidos: profesor.apellidos, id: profesor.id_profesor });
      } else {
        client.release();
        return res.status(401).send('Invalid credentials');
      }
    }
    // Si no está en profesores, buscar en admins
    result = await client.query('SELECT * FROM admins WHERE email = $1', [email]);
    if (result.rows.length > 0) {
      const admin = result.rows[0];
      if (await bcrypt.compare(password, admin.password)) {
        const token = jwt.sign({ userId: admin.id_admin, rol: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
        client.release();
        return res.status(200).json({ token, rol: 'admin', nombre: admin.nombre, apellidos: admin.apellidos, id: admin.id_admin });
      } else {
        client.release();
        return res.status(401).send('Invalid credentials');
      }
    }
    client.release();
    return res.status(401).send('Invalid credentials');
  } catch (err) {
    if (client) client.release();
    console.error(err);
    return res.status(500).send('Error logging in'); // Enviar un mensaje de error de inicio de sesión
  }
});

// Ruta para cambiar la contraseña
app.post('/change-password', checkToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.userId;
  let userRole = null;
  // Extraer el rol del token
  try {
    const authHeader = req.get('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
    if (token) {
      const payload = jwt.decode(token);
      userRole = payload.rol;
    }
  } catch (err) {
    return res.status(401).send('Invalid token');
  }

  if (!currentPassword || !newPassword) {
    return res.status(400).send('Current and new passwords are required');
  }

  try {
    const client = await pool.connect();
    let result;
    if (userRole === 'admin') {
      result = await client.query('SELECT password FROM admins WHERE id_admin = $1', [userId]);
    } else {
      result = await client.query('SELECT password FROM profesores WHERE id_profesor = $1', [userId]);
    }

    if (result.rows.length === 0) {
      client.release();
      return res.status(404).send('User not found');
    }

    const isMatch = await bcrypt.compare(currentPassword, result.rows[0].password);
    if (!isMatch) {
      client.release();
      return res.status(401).send('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    if (userRole === 'admin') {
      await client.query('UPDATE admins SET password = $1 WHERE id_admin = $2', [hashedPassword, userId]);
    } else {
      await client.query('UPDATE profesores SET password = $1 WHERE id_profesor = $2', [hashedPassword, userId]);
    }
    client.release();

    return res.status(200).send('Password changed successfully');
  } catch (err) {
    console.error('Error changing password:', err.message);
    return res.status(500).send('Error changing password');
  }
});

// ############################################################################################################################
// PATCH
// ############################################################################################################################

// PATCH /profesores/:id/permiso (solo admin)
app.patch('/profesores/:id/permiso', checkAdmin, async (req, res) => {
  const idProfesor = parseInt(req.params.id, 10);
  const { puede_gestionar_alumnos } = req.body;
  if (typeof puede_gestionar_alumnos !== 'boolean') {
    return res.status(400).send('El campo puede_gestionar_alumnos debe ser booleano');
  }
  try {
    const client = await pool.connect();
    const result = await client.query(
      'UPDATE profesores SET puede_gestionar_alumnos = $1 WHERE id_profesor = $2 RETURNING id_profesor, nombre, apellidos, email, puede_gestionar_alumnos',
      [puede_gestionar_alumnos, idProfesor]
    );
    client.release();
    if (result.rows.length === 0) {
      return res.status(404).send('Profesor no encontrado');
    }
    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error actualizando permiso:', err.message);
    return res.status(500).send('Error actualizando permiso');
  }
});

// ############################################################################################################################
// DELETE
// ############################################################################################################################

// DELETE /profesores/:id (solo admin)
app.delete('/profesores/:id', checkAdmin, async (req, res) => {
  const idProfesor = parseInt(req.params.id, 10);
  if (isNaN(idProfesor)) {
    return res.status(400).send('ID de profesor inválido');
  }
  try {
    const client = await pool.connect();
    // Eliminar relaciones en profesor_alumno primero (si existen)
    await client.query('DELETE FROM profesor_alumno WHERE id_profesor = $1', [idProfesor]);
    // Eliminar el profesor
    const result = await client.query('DELETE FROM profesores WHERE id_profesor = $1 RETURNING id_profesor', [idProfesor]);
    client.release();
    if (result.rows.length === 0) {
      return res.status(404).send('Profesor no encontrado');
    }
    return res.status(200).json({ message: 'Profesor eliminado correctamente' });
  } catch (err) {
    console.error('Error eliminando profesor:', err.message);
    return res.status(500).send('Error eliminando profesor');
  }
});

// ############################################################################################################################

// Iniciar el servidor
app.listen(PORT, HOST, () => {
  console.log(`Servidor escuchando en http://${HOST}:${PORT}`);
});
// LLMS API endpoint
const llmsRouter = require('./routes/LLMS');
app.use('/ask', llmsRouter);