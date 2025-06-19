import React, { memo } from "react";
import { Box, Button, Checkbox, Container, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Select, TextField, Typography, useTheme } from "@mui/material";
import { useEffect, useState, useRef, useCallback } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { enGB, es, ptBR } from "date-fns/locale"; // Importa los locales para los idiomas
import Chart from "./Chart";
import TableStats from "../Table/TableStats";
import messages from "../../utils/translations.json";
import { useLanguage } from "../../hooks/LanguageContext";

const styles = {
  filtersContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: { xs: 1, sm: 1.5 },
    marginBlock: { xs: 1.5, sm: 2.5 },
    marginInline: { xs: 0.5, sm: 1.25 },
    flexWrap: 'wrap',
    backgroundColor: (theme) => theme.palette.background.default,
    borderRadius: 4,
    boxShadow: (theme) => theme.shadows[2],
    border: (theme) => `1.5px solid ${theme.palette.divider}`,
    p: { xs: 1, sm: 1.5 },
    m: { xs: 0.5, sm: 1 },
    transition: 'background-color 0.3s, color 0.3s, box-shadow 0.3s',
  },
  chartMainContainer: {
    width: '100%',
    height: { xs: 320, sm: 500 },
    position: 'relative',
    backgroundColor: 'transparent',
    boxShadow: 'none',
    borderRadius: 0,
    border: 'none',
    p: 0,
    m: 0,
  },
  noDataOverlay: {
    position: 'absolute',
    left: '50%',
    top: '45%',
    transform: 'translate(-50%, -50%)',
  },
  tableStatsTitle: (theme) => ({
    fontWeight: 900,
    fontSize: 20,
    color: theme.palette.primary.main,
    mb: 2,
    mt: 2, // Añadido margen superior para separar el título de la gráfica
    textAlign: 'center',
    letterSpacing: 0.5,
    textShadow: theme.palette.mode === 'dark'
      ? '0 2px 8px rgba(0,0,0,0.18)'
      : '0 2px 8px rgba(0,0,0,0.08)',
    textTransform: 'uppercase',
    background: 'none',
    border: 'none',
    p: 0,
  }),
  filterFormControl: {
    minWidth: 150,
    '@media (max-width:600px)': {
      minWidth: 110,
    },
  },
  datePickerField: {
    minWidth: 120,
    mx: 0.5,
    '@media (max-width:600px)': {
      minWidth: 80,
    },
  },
  datePickerWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: { xs: 1, sm: 1.5 },
  },
  filterByDateCheckbox: {
    mx: 1,
  },
};

//El uso de memo es para evitar que el componente se vuelva a renderizar innecesariamente
// Esto es útil si el componente recibe props que no cambian con frecuencia
const Charts = memo(({ filteredStats, getJuego, getDificultad }) => {
  const { language } = useLanguage();
  const theme = useTheme();
  const printRef = useRef();
  const [filters, setFilters] = useState({
    minDate: null,
    maxDate: null,
    dificultad: "None",
    juego: "None",
  });
  const [filterByDates, setFilterByDates] = useState(false);
  const [filteredData, setFilteredData] = useState(filteredStats);

  // Mapea el idioma seleccionado al locale correspondiente de date-fns
  const getLocale = () => {
    switch (language) {
      case "en":
        return enGB;
      case "es":
        return es;
      case "pt":
        return ptBR;
      default:
        return ptBR;
    }
  };

  // Actualiza los datos filtrados según los filtros aplicados
  const updateFilters = useCallback(() => {
    let aux = filteredStats;

    if (filterByDates) {
      if (filters.minDate !== null) {
        aux = aux.filter((item) => item.x >= filters.minDate);
      }

      if (filters.maxDate !== null) {
        aux = aux.filter((item) => item.x <= filters.maxDate);
      }
    }

    if (filters.dificultad !== "None") {
      aux = aux.filter((item) => item.dificultad === filters.dificultad);
    }

    if (filters.juego !== "None") {
      aux = aux.filter((item) => item.juego === filters.juego);
    }

    setFilteredData(aux);
  }, [filteredStats, filters, filterByDates]);

  // Actualiza los datos filtrados cada vez que cambian los filtros o los datos originales
  useEffect(() => {
    updateFilters();
  }, [updateFilters]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={getLocale()}>
      <Container>
        <Box sx={styles.filtersContainer}>
          {/* Filtro por dificultad */}
          <FormControl size="small" sx={styles.filterFormControl}>
            <InputLabel size="small">{messages[language]?.difficulty}</InputLabel>
            <Select
              size="small"
              value={filters.dificultad}
              label={messages[language]?.difficulty}
              onChange={(e) => setFilters({ ...filters, dificultad: e.target.value })}
            >
              <MenuItem value={"None"}>{messages[language]?.all}</MenuItem>
              <MenuItem value={"Fácil"}>{messages[language]?.easy}</MenuItem>
              <MenuItem value={"Normal"}>{messages[language]?.normal}</MenuItem>
              <MenuItem value={"Difícil"}>{messages[language]?.hard}</MenuItem>
            </Select>
          </FormControl>

          {/* Filtro por juego */}
          <FormControl size="small" sx={styles.filterFormControl}>
            <InputLabel size="small">{messages[language]?.game}</InputLabel>
            <Select
              size="small"
              value={filters.juego}
              label={messages[language]?.game}
              onChange={(e) => setFilters({ ...filters, juego: e.target.value })}
            >
              <MenuItem value={"None"}>{messages[language]?.all}</MenuItem>
              <MenuItem value={"ejercicioLetras"}>{messages[language]?.letterExercise}</MenuItem>
              <MenuItem value={"ejercicioDesplazamiento"}>{messages[language]?.displacementExercise}</MenuItem>
              <MenuItem value={"operacionesMatematicas"}>{messages[language]?.mathOperations}</MenuItem>
              <MenuItem value={"memoriseNumber"}>{messages[language]?.memorizeNumbers}</MenuItem>
              <MenuItem value={"matchFigures"}>{messages[language]?.matchFigures}</MenuItem>
              <MenuItem value={"ejercicioNumerosIguales"}>{messages[language]?.equalNumbersExercise}</MenuItem>
            </Select>
          </FormControl>

          {/* Checkbox para activar el filtro de fechas */}
          <FormGroup sx={styles.filterByDateCheckbox}>
            <FormControlLabel
              control={<Checkbox checked={filterByDates} onChange={(e) => setFilterByDates(e.target.checked)} />}
              label={messages[language]?.filterByDate}
            />
          </FormGroup>

          {/* Campos de selección de fecha (Desde y Hasta) */}
          {filterByDates && (
            <Box sx={styles.datePickerWrapper}>
              <DatePicker
                label={messages[language]?.from}
                value={filters.minDate}
                onChange={(newValue) => setFilters({ ...filters, minDate: newValue })}
                maxDate={new Date()}
                renderInput={(params) => <TextField {...params} size="small" sx={styles.datePickerField} />}
              />
              <DatePicker
                label={messages[language]?.to}
                value={filters.maxDate}
                onChange={(newValue) => setFilters({ ...filters, maxDate: newValue })}
                renderInput={(params) => <TextField {...params} size="small" sx={styles.datePickerField} />}
                minDate={filters.minDate}
                maxDate={new Date()}
              />
            </Box>
          )}
        </Box>

        {/* Contenedor para la gráfica */}
        <Box sx={styles.chartMainContainer} ref={printRef}>
          {filteredData.length === 0 && (
            <Box sx={styles.noDataOverlay}>
              <Button disabled>
                <Typography variant={"h4"}>{messages[language]?.noData}</Typography>
              </Button>
            </Box>
          )}
          <Chart filteredStats={filteredData} getJuego={getJuego} getDificultad={getDificultad} />
        </Box>

        {/* Contenedor para la tabla */}
        <Typography sx={styles.tableStatsTitle(theme)}>
          {messages[language]?.statsTable}
        </Typography>
        <TableStats stats={filteredData} getJuego={getJuego} getDificultad={getDificultad} />
      </Container>
    </LocalizationProvider>
  );
});

export default Charts;