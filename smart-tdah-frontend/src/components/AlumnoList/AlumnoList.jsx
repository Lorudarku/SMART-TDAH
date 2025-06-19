import React, { useState, useEffect, useCallback, useMemo } from 'react'; 
import axios from 'axios';
import AlumnoLink from '../AlumnoLink/AlumnoLink';
import { backendUrl } from '../../utils/constants';
import { useLanguage } from '../../hooks/LanguageContext';
import messages from '../../utils/translations.json';
import { Box, FormControl, InputLabel, MenuItem, Select, TextField, Paper, Typography, Button, useTheme } from '@mui/material';
import useDebounce from '../../hooks/useDebounce';

const styles = {
  // --- Contenedor principal de la lista ---
  alumnoList: (theme) => ({
    padding: 2.5,
    width: '100%',
    backgroundColor: 'transparent', // No se distingue respecto al Paper padre
    boxShadow: 'none',
    borderRadius: 0,
  }),
  // --- Título de la lista ---
  title: (theme) => ({
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '2rem',
    mb: 2,
    color: theme.palette.text.primary,
  }),
  // --- Contenedor de filtros ---
  filtersContainer: (theme) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2.5,
    padding: 2.5,
    mb: 3,
    width: '100%',
    boxSizing: 'border-box',
    flexWrap: 'wrap',
    backgroundColor: theme.palette.background.default,
    borderRadius: 4,
    boxShadow: theme.shadows[2],
    border: `1.5px solid ${theme.palette.divider}`,
    transition: 'background-color 0.3s, color 0.3s, box-shadow 0.3s',
  }),
  // --- FormControl de filtro ---
  filterFormControl: {
    minWidth: 120,
    flex: '1 1 120px',
    maxWidth: 220,
  },
  // --- Input de búsqueda ---
  filterQueryInput: (theme) => ({
    flex: '2 1 160px',
    minWidth: 100,
    backgroundColor: theme.palette.background.default,
  }),
  // --- Selector de tamaño de página ---
  pageSizeSelector: {
    minWidth: 120,
    flex: '1 1 120px',
    maxWidth: 180,
  },
};

// Componente reutilizable para el paginador
const Paginator = ({ currentPage, totalPages, onPrevious, onNext, language }) => (
  <Box display="flex" justifyContent="center" alignItems="center">
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
  const theme = useTheme(); // Acceso al tema actual

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
      setAlumnoColors((prevColors) => {
        const newColors = { ...prevColors };
        fetchedAlumnos.forEach((alumno) => {
          if (!newColors[alumno.idAlumno]) {
            newColors[alumno.idAlumno] = assignRandomColor(alumno.idAlumno);
          }
        });
        localStorage.setItem('alumnoColors', JSON.stringify(newColors));
        return newColors;
      });

      setAlumnos(fetchedAlumnos);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (err) {
      setError(messages[language]?.fetchError);
      setLoading(false);
    }
  }, [language, currentPage, pageSize, debouncedQuery, filterBy, assignRandomColor]);

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

  // --- ESTILOS PAPER PRINCIPAL (igual que HomePage/Settings) ---
  const mainPaperSx = {
    m: { xs: 1.5, sm: 3, md: 4 },
    borderRadius: 5,
    boxShadow: theme.shadows[8],
    background: theme.palette.background.paper,
    border: `1.5px solid ${theme.palette.divider}`,
    p: { xs: 2, sm: 3 },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transition: 'background-color 0.3s, color 0.3s, box-shadow 0.3s',
    width: '100%',
    maxWidth: 1200,
    overflow: 'visible',
    minHeight: 0,
  };

  return (
    <Box display="flex" justifyContent="center" width="100%">
      <Paper elevation={5} sx={mainPaperSx}>
        {/* Título de la lista de alumnos */}
        <Typography sx={styles.title(theme)} gutterBottom>
          {messages[language]?.studentList}
        </Typography>
        {/* Contenedor para los filtros */}
        <Box sx={styles.filtersContainer(theme)}>
          <FormControl size="small" sx={styles.filterFormControl}>
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
            sx={styles.filterQueryInput(theme)}
            placeholder={messages[language]?.search}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {/* Selector de tamaño de página */}
          <FormControl size="small" sx={styles.pageSizeSelector}>
            <InputLabel>{messages[language]?.pageSize}</InputLabel>
            <Select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
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
        <Box sx={styles.alumnoList(theme)}>
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