CREATE TABLE admins (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100) UNIQUE,
  nombre VARCHAR(100),
  apellidos VARCHAR(100),
  alumnos VARCHAR(100)[]
);

CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100) UNIQUE,
  nombre VARCHAR(100),
  apellidos VARCHAR(100),
  genero VARCHAR(50),
  curso VARCHAR(50)
);

CREATE TABLE ejercicios (
  id SERIAL PRIMARY KEY,
  idUsuario INTEGER REFERENCES usuarios(id),
  -- Comprobar si hay y añadir el resto de campos aquí
);