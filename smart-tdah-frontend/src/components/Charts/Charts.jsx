import { Box, Button, Checkbox, Container, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Paper, Select, TextField, Typography } from "@mui/material";
import { useEffect, useState, useRef, useCallback } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { enGB, es, ptBR } from "date-fns/locale"; // Importa los locales para los idiomas
import Chart from "./Chart";
import TableStats from "../Table/TableStats";
import styles from "./Charts.module.scss";
import messages from "../../utils/translations.json";
import { useLanguage } from "../../hooks/LanguageContext";

const Charts = ({ filteredStats, getJuego, getDificultad }) => {
  const { language } = useLanguage(); // Obtiene el idioma actual
  const printRef = useRef();
  const [filters, setFilters] = useState({
    minDate: null,
    maxDate: null,
    dificultad: "None",
    juego: "None",
  });
  const [filterByDates, setFilterByDates] = useState(false); // Estado para activar/desactivar el filtro de fechas
  const [filteredData, setFilteredData] = useState(filteredStats);

  // Mapea el idioma seleccionado al locale correspondiente de date-fns
  const getLocale = () => {
    switch (language) {
      case "en":
        return enGB; //Great Britain
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
      <Container className={styles.container}>
        <Paper elevation={5} className={styles.paper}>
          <Box className={styles.filtersContainer}>
            {/* Filtro por dificultad */}
            <FormControl size="small">
              <InputLabel size="small">{messages[language]?.difficulty}</InputLabel>
              <Select
                className={styles.filterFormControl}
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
            <FormControl size="small">
              <InputLabel size="small">{messages[language]?.game}</InputLabel>
              <Select
                className={styles.filterFormControl}
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
            <FormGroup>
              <FormControlLabel
                control={<Checkbox checked={filterByDates} onChange={(e) => setFilterByDates(e.target.checked)} />}
                label={messages[language]?.filterByDate}
              />
            </FormGroup>

            {/* Campos de selección de fecha (Desde y Hasta) */}
            {filterByDates && (
              <>
                <DatePicker
                  label={messages[language]?.from}
                  value={filters.minDate}
                  onChange={(newValue) => setFilters({ ...filters, minDate: newValue })}
                  renderInput={(params) => <TextField {...params} size="small" />}
                />
                <DatePicker
                  label={messages[language]?.to}
                  value={filters.maxDate}
                  onChange={(newValue) => setFilters({ ...filters, maxDate: newValue })}
                  renderInput={(params) => <TextField {...params} size="small" />}
                  minDate={filters.minDate} // Asegura que la fecha "Hasta" no sea anterior a "Desde"
                  maxDate={new Date()} // Asegura que la fecha "Hasta" no sea futura
                />
              </>
            )}
          </Box>

          {/* Contenedor para la gráfica */}
          <Box className={styles.chartContainer} ref={printRef}>
            {filteredData.length === 0 && (
              <Box className={styles.noDataBox}>
                <Button disabled>
                  <Typography variant={"h4"}>{messages[language]?.noData}</Typography>
                </Button>
              </Box>
            )}
            <Chart filteredStats={filteredData} getJuego={getJuego} getDificultad={getDificultad} />
          </Box>

          {/* Contenedor para la tabla */}
          <Box className={styles.tableContainer}>
            <Typography textAlign={"center"}>{messages[language]?.statsTable}</Typography>
            <TableStats stats={filteredData} getJuego={getJuego} getDificultad={getDificultad} />
          </Box>
        </Paper>
      </Container>
    </LocalizationProvider>
  );
};

export default Charts;