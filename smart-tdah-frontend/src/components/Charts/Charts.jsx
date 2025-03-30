import { Box, Button, Checkbox, Container, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Paper, Select, TextField, Typography } from "@mui/material";
import { useEffect, useState, useRef, useCallback } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
import Chart from "./Chart";
import TableStats from "../Table/TableStats";
import styles from "./Charts.module.scss"; 

const Charts = ({ filteredStats, getJuego, getDificultad }) => {
  const printRef = useRef();
  const [filters, setFilters] = useState({
    minDate: null,
    maxDate: null,
    dificultad: "None",
    juego: "None",
  });
  const [filterByDates, setFilterByDates] = useState(false); // Estado para activar/desactivar el filtro de fechas
  const [filteredData, setFilteredData] = useState(filteredStats);

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
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Container className={styles.container}>
        <Paper elevation={5} className={styles.paper}>
          <Box className={styles.filtersContainer}>
            {/* Filtro por dificultad */}
            <FormControl size="small">
              <InputLabel size="small">Dificultad</InputLabel>
              <Select
                className={styles.filterFormControl}
                size="small"
                value={filters.dificultad}
                label="Dificultad"
                onChange={(e) => setFilters({ ...filters, dificultad: e.target.value })}
              >
                <MenuItem value={"None"}>Todos</MenuItem>
                <MenuItem value={"Fácil"}>Fácil</MenuItem>
                <MenuItem value={"Normal"}>Normal</MenuItem>
                <MenuItem value={"Difícil"}>Difícil</MenuItem>
              </Select>
            </FormControl>

            {/* Filtro por juego */}
            <FormControl size="small">
              <InputLabel size="small">Juego</InputLabel>
              <Select
                className={styles.filterFormControl}
                size="small"
                value={filters.juego}
                label="Juego"
                onChange={(e) => setFilters({ ...filters, juego: e.target.value })}
              >
                <MenuItem value={"None"}>Todos</MenuItem>
                <MenuItem value={"ejercicioLetras"}>Ejercicio de Letras</MenuItem>
                <MenuItem value={"ejercicioDesplazamiento"}>Ejercicio de Desplazamiento</MenuItem>
                <MenuItem value={"operacionesMatematicas"}>Operaciones Matemáticas</MenuItem>
                <MenuItem value={"memoriseNumber"}>Memorizar Números</MenuItem>
                <MenuItem value={"matchFigures"}>Emparejar Figuras</MenuItem>
                <MenuItem value={"ejercicioNumerosIguales"}>Ejercicio de Números Iguales</MenuItem>
              </Select>
            </FormControl>

            {/* Checkbox para activar el filtro de fechas */}
            <FormGroup>
              <FormControlLabel
                control={<Checkbox checked={filterByDates} onChange={(e) => setFilterByDates(e.target.checked)} />}
                label="Filtrar por fecha"
              />
            </FormGroup>

            {/* Campos de selección de fecha (Desde y Hasta) */}
            {filterByDates && (
              <>
                <DatePicker
                  label="Desde"
                  value={filters.minDate}
                  onChange={(newValue) => setFilters({ ...filters, minDate: newValue })}
                  renderInput={(params) => <TextField {...params} size="small" />}
                />
                <DatePicker
                  label="Hasta"
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
                  <Typography variant={"h4"}>No hay datos</Typography>
                </Button>
              </Box>
            )}
            <Chart filteredStats={filteredData} getJuego={getJuego} getDificultad={getDificultad} />
          </Box>

          {/* Contenedor para la tabla */}
          <Box className={styles.tableContainer}>
            <Typography textAlign={"center"}>Tabla de estadísticas</Typography>
            <TableStats stats={filteredData} getJuego={getJuego} getDificultad={getDificultad} />
          </Box>
        </Paper>
      </Container>
    </LocalizationProvider>
  );
};

export default Charts;