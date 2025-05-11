import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { format } from "date-fns";
import { useLanguage } from "../../hooks/LanguageContext";
import messages from "../../utils/translations.json";

const TableStats = ({ stats, getJuego, getDificultad }) => {
  const { language } = useLanguage(); // Obtiene el idioma actual

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
    <TableContainer>
      <Table id="table">
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography fontSize={"14px"}>{messages[language]?.startDate}</Typography>
            </TableCell>
            <TableCell>
              <Typography fontSize={"14px"}>{messages[language]?.endDate}</Typography>
            </TableCell>
            <TableCell>
              <Typography fontSize={"14px"}>{messages[language]?.duration}</Typography>
            </TableCell>
            <TableCell>
              <Typography fontSize={"14px"}>{messages[language]?.corrects}</Typography>
            </TableCell>
            <TableCell>
              <Typography fontSize={"14px"}>{messages[language]?.errors}</Typography>
            </TableCell>
            <TableCell>
              <Typography fontSize={"14px"}>{messages[language]?.accuracyRatio}</Typography>
            </TableCell>
            <TableCell>
              <Typography fontSize={"14px"}>{messages[language]?.game}</Typography>
            </TableCell>
            <TableCell>
              <Typography fontSize={"14px"}>{messages[language]?.difficulty}</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stats.map((row) => (
            <TableRow
              key={`${row.x}-${row.x1}`} // Clave única basada en las fechas
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <Typography fontSize="14px">
                  {row.x instanceof Date && !isNaN(row.x) ? format(row.x, "dd/MM/yyyy") : messages[language]?.invalidDate}
                </Typography>
                <Typography fontSize="14px">
                  {row.x instanceof Date && !isNaN(row.x) ? format(row.x, "HH:mm:ss") : messages[language]?.invalidTime}
                </Typography>
              </TableCell>
              <TableCell component="th" scope="row">
                <Typography fontSize="14px">
                  {row.x1 instanceof Date && !isNaN(row.x1) ? format(row.x1, "dd/MM/yyyy") : messages[language]?.invalidDate}
                </Typography>
                <Typography fontSize="14px">
                  {row.x1 instanceof Date && !isNaN(row.x1) ? format(row.x1, "HH:mm:ss") : messages[language]?.invalidTime}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography fontSize="14px">
                  {row.x instanceof Date && row.x1 instanceof Date
                    ? Math.round(Math.abs(row.x1.getTime() - row.x.getTime()) / 1000)
                    : messages[language]?.invalidDuration}
                </Typography>
              </TableCell>
              <TableCell>{row.y}</TableCell>
              <TableCell>{row.z}</TableCell>
              <TableCell>{row.r}%</TableCell>
              <TableCell>{translateJuego(getJuego(row.x))}</TableCell>
              <TableCell>{translateDificultad(getDificultad(row.x))}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableStats;