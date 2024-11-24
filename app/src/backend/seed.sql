-- Datos iniciales para la tabla de administradores
INSERT INTO admins (email, nombre, apellidos, alumnos) VALUES
('admin1@example.com', 'Joaquim', 'De Moura', '{}'),
('admin2@example.com', 'Angel', 'Alvarez', '{}');

-- Datos iniciales para la tabla de usuarios
INSERT INTO usuarios (email, nombre, apellidos, genero, curso) VALUES
('user1@example.com', 'Daniel', 'Alumno', 'Masculino', 'Curso 1'),
('user2@example.com', 'Ana', 'Alumna', 'Femenino', 'Curso 2');

-- Datos iniciales para la tabla de ejercicios
INSERT INTO ejercicios (idUsuario, puntuacion, fecha) VALUES
(1, 10, '2021-01-01'),
(1, 8, '2021-01-02'),
(1, 9, '2021-01-03'),
(2, 5, '2021-01-01'),
(2, 7, '2021-01-02'),
(2, 6, '2021-01-03');