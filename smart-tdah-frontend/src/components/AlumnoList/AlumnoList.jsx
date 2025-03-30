import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './AlumnoList.module.scss';
import AlumnoLink from '../AlumnoLink/AlumnoLink';
import { backendUrl } from '../../utils/constants';
import { useLanguage } from '../../hooks/LanguageContext';
import messages from '../../utils/translations.json';
import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';

// Componente que muestra una lista de enlaces a las páginas de los alumnos
function AlumnoList() {
  const [alumnos, setAlumnos] = useState([]); // Estado que almacena la lista de alumnos
  const [filteredAlumnos, setFilteredAlumnos] = useState([]); // Estado para los alumnos filtrados
  const [loading, setLoading] = useState(true); // Estado que indica si se está cargando la lista de alumnos
  const [error, setError] = useState(null); // Estado que almacena un mensaje de error
  const { language } = useLanguage(); // Obtiene el idioma actual

  // Estados para los filtros
  const [filterBy, setFilterBy] = useState('nombre'); // Criterio de filtro (nombre, apellidos, curso)
  const [query, setQuery] = useState(''); // Consulta de búsqueda

  useEffect(() => {
    const fetchAlumnos = async () => {
      const token = localStorage.getItem('token'); // Obtener el token JWT del localStorage
      if (!token) {
        setError(messages[language]?.noTokenProvided); // Mostrar un mensaje de error traducido
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`${backendUrl}/alumnos/`, {
          headers: {
            Authorization: `Bearer ${token}`, // Incluir el token JWT en el encabezado de la solicitud
          },
        });
        setAlumnos(response.data); // Actualizar el estado con la lista de alumnos
        setFilteredAlumnos(response.data); // Inicialmente, mostrar todos los alumnos
        setLoading(false);
      } catch (err) {
        setError(messages[language]?.fetchError); // Mostrar un mensaje de error traducido
        setLoading(false);
      }
    };
    if (loading) {
      fetchAlumnos();
    }
  }, [loading, language]);

  // Filtrar alumnos según el criterio y la consulta
  useEffect(() => {
    const filtered = alumnos.filter((alumno) => {
      const value = alumno[filterBy]?.toLowerCase() || ''; // Obtener el valor del campo seleccionado
      return value.includes(query.toLowerCase()); // Comparar con la consulta
    });
    setFilteredAlumnos(filtered);
  }, [query, filterBy, alumnos]);

  if (loading) {
    return <div>{messages[language]?.loading}</div>; // Muestra un mensaje de carga traducido
  }

  if (error) {
    return <div>{error}</div>; // Muestra un mensaje de error traducido
  }

  return (
    <div className={styles.AlumnoContainer}>
      <h1 className={styles.title}>{messages[language]?.studentList}</h1>

      {/* Contenedor para los filtros */}
      <Box className={styles.filtersContainer}>
        <FormControl size="small" className={styles.filterFormControl}>
          <InputLabel>{messages[language]?.filterBy}</InputLabel>
          <Select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            label={messages[language]?.filterBy}
          >
            <MenuItem value="nombre">{messages[language]?.name}</MenuItem>
            <MenuItem value="apellidos">{messages[language]?.lastName}</MenuItem>
            <MenuItem value="curso">{messages[language]?.course}</MenuItem>
          </Select>
        </FormControl>

        <TextField
          size="small"
          className={styles.filterQueryInput}
          placeholder={messages[language]?.search}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </Box>

      <div className={styles.AlumnoList}>
        {filteredAlumnos.map((alumno) => {
          const alumnoData = {
            idAlumno: alumno.id_alumno,
            email: alumno.email,
            nombre: alumno.nombre,
            apellidos: alumno.apellidos,
            genero: alumno.genero,
            curso: alumno.curso,
          };
          return <AlumnoLink key={alumno.id_alumno} alumnoData={alumnoData} isLoggedIn={true} />;
        })}
      </div>
    </div>
  );
}

export default AlumnoList;