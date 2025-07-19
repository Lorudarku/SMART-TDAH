/**
 * API Route segura para consultas a LLM usando natural-language-postgres.
 * Solo reenvía la consulta y devuelve la respuesta, sin almacenar historial.
 * Cumple SRP y modularidad según copilot.md.
 */
import { NextResponse } from 'next/server';
import { createChat, createNaturalLanguagePostgres } from 'natural-language-postgres';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';

// Configuración de la base de datos y JWT
const JWT_SECRET = process.env.JWT_SECRET;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Puedes agregar más opciones de seguridad aquí
});

// Lee el origen permitido desde variable de entorno
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN;

/**
 * Extrae y verifica el JWT del header Authorization.
 * Devuelve el payload del usuario si es válido, o null si no lo es.
 */
function authenticateToken(req) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return null;
  const token = authHeader.split(' ')[1];
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

// Configura el motor de chat con acceso a la base de datos
const nlp = createNaturalLanguagePostgres({
  db: pool,
  allow: {
    tables: ['alumnos', 'profesores', 'ejercicios', 'profesor_alumno'],
  },
});
const chat = createChat({ tools: [nlp] });

/**
 * Middleware CORS para Next.js API Route
 */
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': FRONTEND_ORIGIN,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}

/**
 * POST /api/vercel-chat
 * Body: { question: string, context?: object }
 * Reenvía la pregunta al LLM+DB y devuelve la respuesta.
 */
export async function POST(req) {
  // Autenticación JWT
  const user = authenticateToken(req);
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { question, context } = await req.json();
  if (!question || typeof question !== 'string') {
    return NextResponse.json({ error: 'Missing or invalid question' }, { status: 400 });
  }

  let prompt = question;
  if (context && typeof context === 'object') {
    prompt += '\nContexto: ' + JSON.stringify(context);
  }

  // Añade cabeceras CORS a la respuesta
  const corsHeaders = {
    'Access-Control-Allow-Origin': FRONTEND_ORIGIN,
    'Access-Control-Allow-Credentials': 'true',
  };

  try {
    const response = await chat({ messages: [{ role: 'user', content: prompt }] });
    const answer = response?.choices?.[0]?.message?.content || '';
    return NextResponse.json({ answer }, { headers: corsHeaders });
  } catch (err) {
    // Log y error seguro
    console.error('Error Vercel AI Chat:', err?.response?.data || err.message);
    return NextResponse.json({ error: 'Error al consultar Vercel AI Chat' }, { status: 500, headers: corsHeaders });
  }
}