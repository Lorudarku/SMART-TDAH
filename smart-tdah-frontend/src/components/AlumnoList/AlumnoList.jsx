import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './AlumnoList.module.scss';
import AlumnoLink from '../AlumnoLink/AlumnoLink';
import { backendUrl } from '../../utils/constants';
import { useLanguage } from '../../hooks/LanguageContext';
import messages from '../../utils/translations.json';
import { Box, FormControl, InputLabel, MenuItem, Select, TextField, Paper, Typography } from '@mui/material';

function AlumnoList() {
  const [alumnos, setAlumnos] = useState([]);
  const [filteredAlumnos, setFilteredAlumnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { language } = useLanguage();

  const [filterBy, setFilterBy] = useState('nombre');
  const [query, setQuery] = useState('');

  useEffect(() => {
    const fetchAlumnos = async () => {
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
        });
        setAlumnos(response.data);
        setFilteredAlumnos(response.data);
        setLoading(false);
      } catch (err) {
        setError(messages[language]?.fetchError);
        setLoading(false);
      }
    };
    if (loading) {
      fetchAlumnos();
    }
  }, [loading, language]);

  useEffect(() => {
    const filtered = alumnos.filter((alumno) => {
      const value = alumno[filterBy]?.toLowerCase() || '';
      return value.includes(query.toLowerCase());
    });
    setFilteredAlumnos(filtered);
  }, [query, filterBy, alumnos]);

  if (loading) {
    return <div>{messages[language]?.loading}</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={4} mb={10}>
      {/* Título de la lista de alumnos */}
      <Typography variant="h5" fontWeight="bold" gutterBottom textAlign="center">
        {messages[language]?.studentList}
      </Typography>

      {/* Contenedor del Paper */}
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
            onChange={(e) => setQuery(e.target.value)}
          />
        </Box>

        {/* Lista de alumnos */}
        <Box className={styles.AlumnoList}>
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
        </Box>
      </Paper>
    </Box>
  );
}

export default AlumnoList;