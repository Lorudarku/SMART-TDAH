
import { useParams, Navigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Charts from '../../components/Charts/Charts';
import { backendUrl } from '../../utils/constants';
import { useLanguage } from '../../hooks/LanguageContext';
import messages from '../../utils/translations.json';
import html2canvas from 'html2canvas';
import pdfMake from 'pdfmake/build/pdfmake';
import { Box, Button, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import SchoolIcon from '@mui/icons-material/School';
import WcIcon from '@mui/icons-material/Wc';

// =====================
// Estilos centralizados y documentados para AlumnoData
// =====================
// Todos los estilos visuales se agrupan en una constante styles.
// Cada línea lleva un comentario claro y contextual.
const styles = (theme) => ({
  // Contenedor principal de la página
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
    position: 'relative',
    width: '100%',
  },
  // Botón de descarga, fijo en la esquina superior derecha
  downloadBtnBox: {
    position: 'fixed',
    top: { xs: 72, sm: 80 }, // Debajo del Banner
    right: { xs: 12, sm: 32 },
    zIndex: 1201, // Por encima del Paper
  },
  // Paper principal: márgenes responsivos, sombra, fondo, bordes
  mainPaper: {
    mx: { xs: 1.5, sm: 3, md: 4 },
    my: { xs: 1.5, sm: 3, md: 4 },
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
    boxSizing: 'border-box',
  },
  // Contenedor de la info del alumno
  alumnoInfo: {
    textAlign: 'center',
    px: { xs: 2, sm: 4 },
    py: { xs: 2, sm: 3 },
    mb: 2,
    borderRadius: 4,
    background: theme.palette.background.default,
    boxShadow: theme.shadows[2],
    border: `1.5px solid ${theme.palette.divider}`,
    transition: 'background-color 0.3s, color 0.3s, box-shadow 0.3s',
    maxWidth: 600,
    mx: 'auto',
  },
  // Nombre del alumno
  alumnoName: {
    fontSize: { xs: '1.5rem', sm: '1.8rem' },
    fontWeight: 'bold',
    mb: 1.25,
    color: theme.palette.primary.main,
    letterSpacing: 0.5,
    textShadow: theme.palette.mode === 'dark'
      ? '0 2px 8px rgba(0,0,0,0.18)'
      : '0 2px 8px rgba(0,0,0,0.08)',
    transition: 'color 0.3s, text-shadow 0.3s',
  },
  // Detalles del alumno (alineados a la izquierda, con iconos)
  alumnoDetails: {
    fontSize: { xs: '1rem', sm: '1.1rem' },
    my: 0.6,
    color: theme.palette.text.secondary,
    transition: 'color 0.3s',
    textAlign: 'left',
    display: 'flex',
    alignItems: 'center',
    gap: 1.2,
  },
  // Loader y errores
  loaderBox: {
    mt: 4,
    display: 'flex',
    justifyContent: 'center',
  },
  errorBox: {
    mt: 4,
    width: '100%',
    maxWidth: 600,
  },
});

function AlumnoData({ isLoggedIn }) {
  const { id_alumno } = useParams();
  const [filteredStats, setFilteredStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const sx = styles(theme); // estilos centralizados
  const { language } = useLanguage();
  const statsRef = useRef();

  useEffect(() => {
    if (!id_alumno || isNaN(id_alumno)) {
      setError(messages[language]?.invalidStudentId);
      setLoading(false);
      return;
    }
    const fetchAlumnoData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError(messages[language]?.noTokenProvided);
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`${backendUrl}/alumnos/${id_alumno}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const alumnoEjercicioData = response.data.map((item) => ({
          nombre: item.nombre,
          apellidos: item.apellidos,
          email: item.email,
          genero: item.genero,
          curso: item.curso,
          x: new Date(item.date_inicio),
          x1: new Date(item.date_fin),
          y: parseInt(item.aciertos),
          z: parseInt(item.fallos),
          r: Math.round(
            (parseInt(item.fallos) === 0
              ? 100
              : (parseInt(item.aciertos) /
                  (parseInt(item.aciertos) + parseInt(item.fallos))) *
                100) * 100
          ) / 100,
          dificultad: item.dificultad,
          juego: item.tipo_ejercicio,
        }))
        .sort((a, b) => a.x - b.x);
        setFilteredStats(alumnoEjercicioData);
        setLoading(false);
      } catch (err) {
        setError(messages[language]?.fetchError);
        setLoading(false);
      }
    };
    fetchAlumnoData();
  }, [id_alumno, language]);

  // Memoiza el array de estadísticas para evitar cálculos innecesarios
  const filteredStatsMemo = useMemo(() => filteredStats, [filteredStats]);

  // Indexa los datos por fecha para acceso O(1) en la tabla
  const statsByDate = useMemo(() => {
    const map = new Map();
    filteredStats.forEach(item => map.set(item.x?.getTime?.() ?? item.x, item));
    return map;
  }, [filteredStats]);

  // Memoiza las funciones de acceso para evitar recrearlas en cada render
  const getJuego = useCallback((date) => {
    const key = date?.getTime?.() ?? date;
    return statsByDate.get(key)?.juego;
  }, [statsByDate]);

  const getDificultad = useCallback((date) => {
    const key = date?.getTime?.() ?? date;
    return statsByDate.get(key)?.dificultad;
  }, [statsByDate]);

  const handleDownloadReport = async () => {
    if (statsRef.current) {
      try {
        const originalBackground = statsRef.current.style.backgroundColor;
        statsRef.current.style.backgroundColor =
          theme.palette.mode === 'dark' ? theme.palette.background.default : '#ffffff';
        const canvas = await html2canvas(statsRef.current, {
          useCORS: true,
          scale: 2,
        });
        statsRef.current.style.backgroundColor = originalBackground;
        const imgWidth = 500;
        const pageHeight = 700;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const totalPages = Math.ceil(imgHeight / pageHeight);
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
            margin: [0, 0, 0, i < totalPages - 1 ? 20 : 0],
          });
        }
        const docDefinition = { content: pdfContent };
        pdfMake.createPdf(docDefinition).download(`${messages[language]?.reportFileName}_${id_alumno}.pdf`);
      } catch (err) {
        console.error(messages[language]?.reportError, err);
      }
    }
  };

  // Layout principal
  return isLoggedIn ? (
    <Box sx={sx.root}>
      {/* Botón para descargar el informe, fijo en la esquina superior derecha */}
      <Box sx={sx.downloadBtnBox}>
        <Button variant="contained" color="primary" onClick={handleDownloadReport}>
          {messages[language]?.downloadReport}
        </Button>
      </Box>
      {/* Contenedor para la información del alumno y las gráficas */}
      <Paper ref={statsRef} elevation={5} sx={sx.mainPaper}>
        <Box sx={sx.alumnoInfo}>
          <Typography sx={sx.alumnoName} component="h1">
            {filteredStats[0]?.nombre} {filteredStats[0]?.apellidos}
          </Typography>
          <Typography sx={sx.alumnoDetails} component="p">
            <EmailIcon fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
            <strong>{messages[language]?.email}:</strong> {filteredStats[0]?.email}
          </Typography>
          <Typography sx={sx.alumnoDetails} component="p">
            <SchoolIcon fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
            <strong>{messages[language]?.course}:</strong> {filteredStats[0]?.curso}
          </Typography>
          <Typography sx={sx.alumnoDetails} component="p">
            <WcIcon fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
            <strong>{messages[language]?.gender}:</strong> {filteredStats[0]?.genero || '-'}
          </Typography>
        </Box>
        {/* Contenedor para las gráficas */}
        <Charts
          filteredStats={filteredStatsMemo}
          getJuego={getJuego}
          getDificultad={getDificultad}
        />
      </Paper>
      {/* Loader y errores */}
      {loading && (
        <Box sx={sx.loaderBox}><CircularProgress /></Box>
      )}
      {error && (
        <Box sx={sx.errorBox}><Alert severity="error">{error}</Alert></Box>
      )}
    </Box>
  ) : (
    <main>
      <Navigate to={{ pathname: '/login' }} />
    </main>
  );
}

export default AlumnoData;