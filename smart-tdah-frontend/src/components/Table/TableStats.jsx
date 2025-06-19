import React, { memo } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { format } from "date-fns";
import { useLanguage } from "../../hooks/LanguageContext";
import messages from "../../utils/translations.json";
import { useTheme } from "@mui/material/styles";

// Estilos centralizados y claros para la tabla de estadísticas (mismo formato que Profile)
const styles = {
  container: (theme) => ({
    background: theme.palette.background.default,
    borderRadius: 4,
    boxShadow: theme.shadows[1],
    border: `1.5px solid ${theme.palette.divider}`,
    overflowX: 'auto', // Permite scroll horizontal si es necesario
    overflowY: 'hidden',
    mt: 2,
  }),
  headCell: (theme) => ({
    background: theme.palette.background.default, //
    color: theme.palette.text.primary,
    fontWeight: 700,
    fontSize: 15,
    borderBottom: `2px solid ${theme.palette.divider}`,
    letterSpacing: 0.2,
    py: 1.2,
  }),
  bodyCell: (theme) => ({
    background: theme.palette.background.paper,
    fontSize: 14,
    borderBottom: `1px solid ${theme.palette.divider}`,
    py: 1,
  }),
  rowEven: (theme) => ({
    background: theme.palette.background.default,
    color: theme.palette.text.primary,
  }),
  rowOdd: (theme) => ({
    background: theme.palette.action.selected,
    color: theme.palette.text.primary,
  }),
};

//El uso de memo es para optimizar el rendimiento del componente, evitando renderizados innecesarios
// al comparar las props y asegurando que solo se vuelva a renderizar si las props cambian.
const TableStats = memo(({ stats, getJuego, getDificultad }) => {
  const { language } = useLanguage();
  const theme = useTheme();

  const translateJuego = (juego) => {
    switch (juego) {
      case "ejercicioLetras":
        return messages[language]?.letterExercise;
      case "ejercicioDesplazamiento":
        return messages[language]?.displacementExercise;
      case "operacionesMatematicas":
        return messages[language]?.mathOperations;
      case "memoriseNumber":
        return messages[language]?.memorizeNumbers;
      case "matchFigures":
        return messages[language]?.matchFigures;
      case "ejercicioNumerosIguales":
        return messages[language]?.equalNumbersExercise;
      default:
        return juego || "-";
    }
  };

  const translateDificultad = (dificultad) => {
    switch (dificultad) {
      case "Fácil":
        return messages[language]?.easy;
      case "Normal":
        return messages[language]?.normal;
      case "Difícil":
        return messages[language]?.hard;
      default:
        return dificultad || "-";
    }
  };

  return (
    <TableContainer sx={styles.container(theme)}>
      <Table id="table">
        <TableHead>
          <TableRow>
            <TableCell sx={styles.headCell(theme)}>
              <Typography fontWeight={700} fontSize={15}>{messages[language]?.startDate}</Typography>
            </TableCell>
            <TableCell sx={styles.headCell(theme)}>
              <Typography fontWeight={700} fontSize={15}>{messages[language]?.endDate}</Typography>
            </TableCell>
            <TableCell sx={styles.headCell(theme)}>
              <Typography fontWeight={700} fontSize={15}>{messages[language]?.duration}</Typography>
            </TableCell>
            <TableCell sx={styles.headCell(theme)}>
              <Typography fontWeight={700} fontSize={15}>{messages[language]?.corrects}</Typography>
            </TableCell>
            <TableCell sx={styles.headCell(theme)}>
              <Typography fontWeight={700} fontSize={15}>{messages[language]?.errors}</Typography>
            </TableCell>
            <TableCell sx={styles.headCell(theme)}>
              <Typography fontWeight={700} fontSize={15}>{messages[language]?.accuracyRatio}</Typography>
            </TableCell>
            <TableCell sx={styles.headCell(theme)}>
              <Typography fontWeight={700} fontSize={15}>{messages[language]?.game}</Typography>
            </TableCell>
            <TableCell sx={styles.headCell(theme)}>
              <Typography fontWeight={700} fontSize={15}>{messages[language]?.difficulty}</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stats.map((row, idx) => (
            <TableRow
              key={`${row.x}-${row.x1}`}
              sx={idx % 2 === 0 ? styles.rowEven(theme) : styles.rowOdd(theme)}
            >
              <TableCell sx={styles.bodyCell(theme)} component="th" scope="row">
                <Typography fontSize={14} fontWeight={500}>
                  {row.x instanceof Date && !isNaN(row.x) ? format(row.x, "dd/MM/yyyy") : messages[language]?.invalidDate}
                </Typography>
                <Typography fontSize={13} color="text.secondary">
                  {row.x instanceof Date && !isNaN(row.x) ? format(row.x, "HH:mm:ss") : messages[language]?.invalidTime}
                </Typography>
              </TableCell>
              <TableCell sx={styles.bodyCell(theme)} component="th" scope="row">
                <Typography fontSize={14} fontWeight={500}>
                  {row.x1 instanceof Date && !isNaN(row.x1) ? format(row.x1, "dd/MM/yyyy") : messages[language]?.invalidDate}
                </Typography>
                <Typography fontSize={13} color="text.secondary">
                  {row.x1 instanceof Date && !isNaN(row.x1) ? format(row.x1, "HH:mm:ss") : messages[language]?.invalidTime}
                </Typography>
              </TableCell>
              <TableCell sx={styles.bodyCell(theme)}>
                <Typography fontSize={14}>
                  {row.x instanceof Date && row.x1 instanceof Date
                    ? Math.round(Math.abs(row.x1.getTime() - row.x.getTime()) / 1000)
                    : messages[language]?.invalidDuration}
                </Typography>
              </TableCell>
              <TableCell sx={styles.bodyCell(theme)}>{row.y}</TableCell>
              <TableCell sx={styles.bodyCell(theme)}>{row.z}</TableCell>
              <TableCell sx={styles.bodyCell(theme)}>{row.r}%</TableCell>
              <TableCell sx={styles.bodyCell(theme)}>{translateJuego(getJuego(row.x))}</TableCell>
              <TableCell sx={styles.bodyCell(theme)}>{translateDificultad(getDificultad(row.x))}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
});

export default TableStats;