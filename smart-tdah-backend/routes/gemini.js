/**
 * Endpoint seguro para consultas a Gemini API.
 * No almacena historial, solo reenvía la consulta y devuelve la respuesta.
 * Cumple SRP y modularidad según copilot.md.
 */
const express = require('express');
const router = express.Router();
const axios = require('axios');
const jwt = require('jsonwebtoken');
const pool = require('../dbConfig');

// Cargar clave secreta y API key de Gemini desde .env
const JWT_SECRET = process.env.JWT_SECRET;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Middleware de autenticación JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

/**
 * POST /api/gemini/ask
 * Body: { question: string, context: object }
 * Reenvía la pregunta a Gemini y devuelve la respuesta.
 */
router.post('/ask', authenticateToken, async (req, res) => {
  const { question, studentId, IaModel } = req.body;
  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid question' });
  }

  // escojemos el modelo que queremos seguir
  const askIa = (prompt) => {
    switch (IaModel) {
      case "gemini":
        return askGeminiAI(prompt)
        break;
      case "vercel":
        return askVercelAI(prompt)
        break

      default:
        return askGeminiAI(prompt)
        break;
    }

  }

  // Usamos Vercel para la consulta es solo un ejmplo!!!!!
  const askVercelAI = async (prompt) => {
    try {
      // Llama a la API de Gemini usando el modelo gratuito y el header correcto
      const geminiRes = await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
        {
          contents: [{ parts: [{ text: prompt }] }],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-goog-api-key': GEMINI_API_KEY,
          },
        }
      );
      // Extrae la respuesta generada
      const answer = geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      return answer;
    } catch (err) {
      // Log y error seguro
      console.error('Error Gemini:', err?.response?.data || err.message);
      return res.status(500).json({ error: 'Error al consultar Gemini' });
    }

  }
  // Usamos Gemini para la consulta
  const askGeminiAI = async (prompt) => {
    try {
      // Llama a la API de Gemini usando el modelo gratuito y el header correcto
      const geminiRes = await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
        {
          contents: [{ parts: [{ text: prompt }] }],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-goog-api-key': GEMINI_API_KEY,
          },
        }
      );
      // Extrae la respuesta generada
      const answer = geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      return answer;
    } catch (err) {
      // Log y error seguro
      console.error('Error Gemini:', err?.response?.data || err.message);
      return res.status(500).json({ error: 'Error al consultar Gemini' });
    }

  }
  // Procesamos los datos para dar la respuesta al usuario
  const proccessData = async (data, unnecessary) => {
    const prompt = `
        Dados los siguientes datos contesta la pregunta del usuario
        Eres una IA de procesamientos de datos para un instituto que tiene datos de los ejercicios y de los alumnos 
        Tu trabajo es ayudar a los profesores a evaluar el rendimiento de los mismo
        Contesta en el idioma que te hagan la pregunta
        
        pregunta: ${question} ${unnecessary && 'datos:', JSON.stringify(data)}
          `;
    console.log(prompt, 'prompt2222222')

    const response = await askIa(prompt)
    console.log(response, 'response2222222')
    return response
  };

  // Usamos la IA para generar la llamada SQL de postgres para obtener los datos necesarios
  const getQuery = async (question) => {
    console.log(question, 'question')
    const prompt = `
        You are a SQL (postgres) and data visualization expert. Your job is to help the user write a SQL query to retrieve the data they need. The table schema is as follows:

          alumnos (
            id_alumno SERIAL PRIMARY KEY,
            email VARCHAR(100) UNIQUE NOT NULL,
            nombre VARCHAR(50) NOT NULL,
            apellidos VARCHAR(100) NOT NULL,
            genero VARCHAR(10), 
            curso VARCHAR(20)
          );

          ejercicios (
            id_ejercicio SERIAL PRIMARY KEY, 
            id_alumno INTEGER REFERENCES alumnos(id_alumno),
            aciertos INTEGER NOT NULL,
            fallos INTEGER NOT NULL,
            letras_correctas INTEGER NOT NULL,
            date_inicio TIMESTAMP NOT NULL,
            date_fin TIMESTAMP NOT NULL,
            dificultad VARCHAR(50) NOT NULL, 
            tipo_ejercicio VARCHAR(50) NOT NULL
          );

        Only retrieval queries are allowed.

        If you are asked about a specific student use the student with the id_alumno = ${studentId}
        If no data is required for you to reply, return a "unnecessary"
        Generate the query necesary to retrieve the data based on the user's question: ${question}
          `;
    const response = await askIa(prompt)
    // Arreglamos el formato de la consulta SQL
    if (IaModel === 'gemini'&& !response.includes("unnecessary")) {
      return response.slice(6, -4);
    }
    return response
  };
  // ejecutamos la consulta SQL para optener los datos necesarios
  const getDataByQuery = async (query) => {


    const client = await pool.connect(); //Establece una conexión con la base de datos.
    const res = await client.query(query); //Ejecuta una consulta SQL para buscar un usuario con el correo electrónico proporcionado.
    client.release(); //Libera la conexión con la base de datos.
    const data = res.rows
    return data
  }


  const query = await getQuery(question)
  console.log(query, 'query')
  let data
  if (!query.includes("unnecessary")) {
    data = await getDataByQuery(query)
  }
  const answer = await proccessData(data, !query.includes("unnecessary"))


  return res.json({ text: answer });


});

module.exports = router;
