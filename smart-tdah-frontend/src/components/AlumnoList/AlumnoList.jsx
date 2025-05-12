import React, { useState, useEffect, useCallback, useMemo } from 'react'; 
import axios from 'axios';
import styles from './AlumnoList.module.scss';
import AlumnoLink from '../AlumnoLink/AlumnoLink';
import { backendUrl } from '../../utils/constants';
import { useLanguage } from '../../hooks/LanguageContext';
import messages from '../../utils/translations.json';
import { Box, FormControl, InputLabel, MenuItem, Select, TextField, Paper, Typography, Button } from '@mui/material';
import useDebounce from '../../hooks/useDebounce';

// Componente reutilizable para el paginador
const Paginator = ({ currentPage, totalPages, onPrevious, onNext, language }) => (
  <Box display="flex" justifyContent="center" alignItems="center" mt={3}>
    <Button
      variant="contained"
      onClick={onPrevious}
      disabled={currentPage <= 1} // Deshabilitar si estamos en la primera página
      sx={{ marginRight: 2 }}
    >
      {messages[language]?.previous}
    </Button>
    <Typography variant="body1">
      {messages[language]?.page} {currentPage} {messages[language]?.of} {totalPages}
    </Typography>
    <Button
      variant="contained"
      onClick={onNext}
      disabled={currentPage >= totalPages} // Deshabilitar si estamos en la última página
      sx={{ marginLeft: 2 }}
    >
      {messages[language]?.next}
    </Button>
  </Box>
);

function AlumnoList() {
  const [alumnos, setAlumnos] = useState([]);
  const [alumnoColors, setAlumnoColors] = useState(() => {
    const storedColors = localStorage.getItem('alumnoColors');
    return storedColors ? JSON.parse(storedColors) : {};
  }); // Carga los colores desde localStorage
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { language } = useLanguage();

  const [filterBy, setFilterBy] = useState('nombre');
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  const [pageSize, setPageSize] = useState(16);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const colors = useMemo(() => ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF'], []); 

  const assignRandomColor = useCallback(
    (idAlumno) => {
      const randomIndex = idAlumno % colors.length; // Asigna un color basado en el ID del alumno
      return colors[randomIndex];
    },
    [colors] 
  );

  const fetchAlumnos = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError(messages[language]?.noTokenProvided);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${backendUrl}/alumnos/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: currentPage,
          page_size: pageSize,
          filter_by: debouncedQuery ? filterBy : null,
          query: debouncedQuery || null,
        },
      });

      const fetchedAlumnos = response.data.alumnos.map((alumno) => ({
        idAlumno: alumno.id_alumno, // Asegúrate de que idAlumno esté presente
        nombre: alumno.nombre,
        apellidos: alumno.apellidos,
        email: alumno.email,
        curso: alumno.curso,
      }));

      // Generar colores solo para los alumnos que no tienen color asignado
      const newColors = { ...alumnoColors };
      fetchedAlumnos.forEach((alumno) => {
        if (!newColors[alumno.idAlumno]) {
          newColors[alumno.idAlumno] = assignRandomColor(alumno.idAlumno);
        }
      });

      setAlumnos(fetchedAlumnos);
      setAlumnoColors(newColors); // Actualiza los colores en el estado
      localStorage.setItem('alumnoColors', JSON.stringify(newColors)); // Guarda los colores en localStorage
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (err) {
      setError(messages[language]?.fetchError);
      setLoading(false);
    }
  }, [language, currentPage, pageSize, debouncedQuery, filterBy, alumnoColors, assignRandomColor]);

  useEffect(() => {
    fetchAlumnos();
  }, [fetchAlumnos]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Manejar cambio a la página siguiente
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (loading) {
    return <div>{messages[language]?.loading}</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={4} mb={10}>
      {/* Título de la lista de alumnos */}
      <Typography className={styles.title} gutterBottom>
        {messages[language]?.studentList}
      </Typography>

      <Paper
        elevation={5}
        sx={{
          padding: 3,
          maxWidth: 1200,
          width: '95%', // Reduce el ancho para dejar márgenes laterales
          margin: '0 auto', // Centra el Paper horizontalmente
          marginBottom: 10, // Deja un margen inferior similar al de Charts.jsx
        }}
      >
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
            onChange={(e) => setQuery(e.target.value)} // Actualiza el estado query
          />

          {/* Selector de tamaño de página */}
          <FormControl size="small" className={styles.pageSizeSelector}>
            <InputLabel>{messages[language]?.pageSize}</InputLabel>
            <Select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value)); // Actualizar el tamaño de página
                setCurrentPage(1); // Reiniciar la página actual al cambiar el tamaño de página
              }}
              label={messages[language]?.pageSize}
            >
              <MenuItem value={8}>8</MenuItem>
              <MenuItem value={16}>16</MenuItem>
              <MenuItem value={32}>32</MenuItem>
              <MenuItem value={64}>64</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Paginador al inicio */}
        <Paginator
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevious={handlePreviousPage}
          onNext={handleNextPage}
          language={language}
        />

        {/* Lista de alumnos */}
        <Box className={styles.AlumnoList}>
          {alumnos.map((alumno) => (
            <AlumnoLink key={alumno.idAlumno} alumnoData={alumno} backgroundColor={alumnoColors[alumno.idAlumno]} isLoggedIn={true} />
          ))}
        </Box>

        {/* Paginador al final */}
        <Paginator
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevious={handlePreviousPage}
          onNext={handleNextPage}
          language={language}
        />
      </Paper>
    </Box>
  );
}

export default AlumnoList;