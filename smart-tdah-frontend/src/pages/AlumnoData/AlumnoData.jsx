import { useParams, Navigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '@mui/material/styles'; // Importa el hook useTheme
import React, { useState, useEffect } from 'react';
import Charts from '../../components/Charts/Charts';
import { backendUrl } from '../../utils/constants';
import styles from './AlumnoData.module.scss'; // Importa los estilos
import { useLanguage } from '../../hooks/LanguageContext'; // Importa el contexto de idioma
import messages from '../../utils/translations.json'; // Importa las traducciones

function AlumnoData({ isLoggedIn }) {
  const { id_alumno } = useParams(); // Obtiene el id del alumno de los parámetros de la URL.
  const [filteredStats, setFilteredStats] = useState([]); // Estado que almacena las estadísticas filtradas del alumno.
  const [loading, setLoading] = useState(true); // Estado que indica si se están cargando las estadísticas.
  const [error, setError] = useState(null); // Estado que almacena un mensaje de error.
  const theme = useTheme(); // Obtiene el tema actual (claro u oscuro)
  const { language } = useLanguage(); // Obtiene el idioma actual

  useEffect(() => {
    if (!id_alumno || isNaN(id_alumno)) {
      console.error("Invalid id_alumno:", id_alumno); // Log para depuración
      setError('Invalid student ID'); // Valida que id_alumno no sea undefined o no numérico
      setLoading(false);
      return;
    }

    const fetchAlumnoData = async () => {
      const token = localStorage.getItem('token'); // Obtener el token JWT del localStorage.
      if (!token) {
        setError('No token provided'); // Mostrar un mensaje de error.
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`${backendUrl}/alumnos/${id_alumno}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Incluir el token JWT en el encabezado de la solicitud
          },
        });
        const alumnoEjercicioData = response.data.map((item) => ({
          nombre: item.nombre, // Nombre del alumno.
          apellidos: item.apellidos, // Apellidos del alumno.
          email: item.email, // Email del alumno.
          genero: item.genero, // Género del alumno.
          curso: item.curso, // Curso del alumno.

          x: new Date(item.date_inicio), // Convertir la fecha a un objeto Date.
          x1: new Date(item.date_fin), // Convertir la fecha a un objeto Date.
          y: parseInt(item.aciertos), // Convertir los aciertos a un número entero.
          z: parseInt(item.fallos), // Convertir los errores a un número entero.
          r: Math.round(
            (parseInt(item.fallos) === 0
              ? 100
              : (parseInt(item.aciertos) /
                  (parseInt(item.aciertos) + parseInt(item.fallos))) *
                100) * 100
          ) / 100, // Calcular el porcentaje de aciertos.
          dificultad: item.dificultad, // Nivel de dificultad.
          juego: item.tipo_ejercicio, // Juego.
        }))
        .sort((a, b) => a.x - b.x); // Ordenar los datos por fecha.
        console.log('Datos cargados:', alumnoEjercicioData); // Verifica los datos aquí
        setFilteredStats(alumnoEjercicioData); // Almacena las estadísticas en el estado.
        setLoading(false); // Indica que se han cargado las estadísticas.
      } catch (err) {
        setError('Error fetching stats');
        setLoading(false);
      }
    };
    fetchAlumnoData();
  }, [id_alumno]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const getJuego = (date) => {
    const juego = filteredStats.find((item) => item.x === date)?.juego;
    return juego;
  };

  const getDificultad = (date) => {
    const dificultad = filteredStats.find((item) => item.x === date)?.dificultad;
    return dificultad;
  };

  return isLoggedIn ? (
    <div>
      {/* Contenedor para la información del alumno */}
      <div className={styles.alumnoInfoContainer}>
        <h1 className={styles.alumnoName}>
          {filteredStats[0]?.nombre} {filteredStats[0]?.apellidos}
        </h1>
        <p
          className={styles.alumnoDetails}
          style={{
            color: theme.palette.mode === 'dark' ? theme.palette.text.primary : '#555', // Gris en modo claro
          }}
        >
          <strong>{messages[language]?.email}:</strong> {filteredStats[0]?.email}
        </p>
        <p
          className={styles.alumnoDetails}
          style={{
            color: theme.palette.mode === 'dark' ? theme.palette.text.primary : '#555', // Gris en modo claro
          }}
        >
          <strong>{messages[language]?.course}:</strong> {filteredStats[0]?.curso}
        </p>
        <p
          className={styles.alumnoDetails}
          style={{
            color: theme.palette.mode === 'dark' ? theme.palette.text.primary : '#555', // Gris en modo claro
          }}
        >
          <strong>{messages[language]?.gender}:</strong> {filteredStats[0]?.genero || '-'}
        </p>
      </div>

      {/* Contenedor para las gráficas */}
      <Charts
        filteredStats={filteredStats}
        getJuego={getJuego}
        getDificultad={getDificultad}
      />
    </div>
  ) : (
    <main>
      <Navigate
        to={{
          pathname: '/login',
        }}
      />
    </main>
  );
}

export default AlumnoData;