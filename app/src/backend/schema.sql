-- Tabla de administradores (profesores)
CREATE TABLE admins (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  apellidos VARCHAR(100) NOT NULL,
  alumnos VARCHAR(100)[]
);

-- Tabla de usuarios (alumnos)
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  apellidos VARCHAR(100) NOT NULL,
  genero VARCHAR(50),
  curso VARCHAR(50)
);

-- Tabla de ejercicios (sobre los que se evalua a los alumnos)
CREATE TABLE ejercicios (
  id SERIAL PRIMARY KEY,
  idUsuario INTEGER REFERENCES usuarios(id),
  puntuacion INTEGER,
  fecha DATE
);