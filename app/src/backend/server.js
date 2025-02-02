const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const bcrypt = require('bcrypt');
const pool = require('./dbConfig');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3001;
const JWT_SECRET = 'smart-tdah'; // Clave secreta para firmar los tokens JWT

app.use(cors()); // Usa el middleware cors
app.use(bodyParser.json());

// Ruta de prueba para verificar la conexión a la base de datos
app.get('/test-db', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    res.send(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error connecting to the database');
  }
});

// Ruta de registro
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id',
      [username, email, hashedPassword]
    );
    client.release();
    res.status(201).json({ userId: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error registering new user');
  }
});

// Ruta de login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      res.status(401).send('Invalid credentials');
      return;
    }

    const user = result.rows[0];
    if (await bcrypt.compare(password, user.password)) {
      // Generar un token JWT
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' }); // El token expira en 1 hora
      res.status(200).json({ token });
    } else {
      res.status(401).send('Invalid credentials');
    }
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send('Error logging in');
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});