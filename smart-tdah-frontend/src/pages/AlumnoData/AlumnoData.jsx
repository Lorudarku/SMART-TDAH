import { useParams, Navigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '@mui/material/styles'; // Importa el hook useTheme
import React, { useState, useEffect, useRef } from 'react';
import Charts from '../../components/Charts/Charts';
import { backendUrl } from '../../utils/constants';
import styles from './AlumnoData.module.scss'; // Importa los estilos
import { useLanguage } from '../../hooks/LanguageContext'; // Importa el contexto de idioma
import messages from '../../utils/translations.json'; // Importa las traducciones
import html2canvas from 'html2canvas'; // Importa la librería para capturar la instantánea
import pdfMake from 'pdfmake/build/pdfmake'; // Importa solo pdfMake
import { Box, Button } from '@mui/material';

function AlumnoData({ isLoggedIn }) {
  const { id_alumno } = useParams(); // Obtiene el id del alumno de los parámetros de la URL.
  const [filteredStats, setFilteredStats] = useState([]); // Estado que almacena las estadísticas filtradas del alumno.
  const [loading, setLoading] = useState(true); // Estado que indica si se están cargando las estadísticas.
  const [error, setError] = useState(null); // Estado que almacena un mensaje de error.
  const theme = useTheme(); // Obtiene el tema actual (claro u oscuro)
  const { language } = useLanguage(); // Obtiene el idioma actual
  const statsRef = useRef(); // Referencia al contenedor de estadísticas

  useEffect(() => {
    if (!id_alumno || isNaN(id_alumno)) {
      console.error("Invalid id_alumno:", id_alumno); // Log para depuración
      setError(messages[language]?.invalidStudentId); // Valida que id_alumno no sea undefined o no numérico
      setLoading(false);
      return;
    }

    const fetchAlumnoData = async () => {
      const token = localStorage.getItem('token'); // Obtener el token JWT del localStorage.
      if (!token) {
        setError(messages[language]?.noTokenProvided); // Mostrar un mensaje de error.
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
        setError(messages[language]?.fetchError);
        setLoading(false);
      }
    };
    fetchAlumnoData();
  }, [id_alumno, language]);

  const handleDownloadReport = async () => {
    if (statsRef.current) {
      try {
        // Ajustar estilos temporalmente
        const originalBackground = statsRef.current.style.backgroundColor;

        // Establece el fondo según el tema actual
        statsRef.current.style.backgroundColor =
          theme.palette.mode === 'dark' ? theme.palette.background.default : '#ffffff';

        const canvas = await html2canvas(statsRef.current, {
          useCORS: true,
          scale: 2,
        });

        // Restaurar estilos originales
        statsRef.current.style.backgroundColor = originalBackground;
        
        const imgWidth = 500; // Ancho de la imagen en el PDF
        const pageHeight = 700; // Altura de la página en el PDF
        const imgHeight = (canvas.height * imgWidth) / canvas.width; // Escala la altura de la imagen
        const totalPages = Math.ceil(imgHeight / pageHeight); // Calcula el número total de páginas

        const pdfContent = [];
        for (let i = 0; i < totalPages; i++) {
          const cropCanvas = document.createElement('canvas');
          const cropContext = cropCanvas.getContext('2d');
          cropCanvas.width = canvas.width;
          cropCanvas.height = Math.min(pageHeight * (canvas.width / imgWidth), canvas.height - i * pageHeight * (canvas.width / imgWidth));

          cropContext.drawImage(
            canvas,
            0,
            i * pageHeight * (canvas.width / imgWidth),
            canvas.width,
            cropCanvas.height,
            0,
            0,
            cropCanvas.width,
            cropCanvas.height
          );

          const croppedImgData = cropCanvas.toDataURL('image/png');
          pdfContent.push({
            image: croppedImgData,
            width: imgWidth,
            margin: [0, 0, 0, i < totalPages - 1 ? 20 : 0], // Añade margen inferior excepto en la última página
          });
        }

        const docDefinition = { content: pdfContent };

        // Genera y descarga el PDF
        pdfMake.createPdf(docDefinition).download(`${messages[language]?.reportFileName}_${id_alumno}.pdf`);
      } catch (err) {
        console.error(messages[language]?.reportError, err);
      }
    }
  };

  if (loading) {
    return <div>{messages[language]?.loading}</div>;
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
      {/* Botón para descargar el informe */}
      <Box display="flex" justifyContent="flex-end" p={2}>
        <Button variant="contained" color="primary" onClick={handleDownloadReport}>
          {messages[language]?.downloadReport}
        </Button>
      </Box>

      {/* Contenedor para la información del alumno */}
      <div ref={statsRef}>
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