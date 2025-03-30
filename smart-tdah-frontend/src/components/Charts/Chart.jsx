import { Paper, Typography } from "@mui/material";
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Area, LabelList } from "recharts";
import { format } from "date-fns";
import messages from '../../utils/translations.json';
import { useLanguage } from '../../hooks/LanguageContext';

const Chart = ({ filteredStats }) => {
  const { language } = useLanguage(); // Obtiene el idioma actual

  const getDomain = () => { // Función que obtiene el dominio mínimo y máximo de las fechas.
    const arrayDates = filteredStats.map((item) => item.x); // Mapear las fechas.
    return {
      min: Math.min.apply(null, arrayDates), // Obtener la fecha mínima.
      max: Math.max.apply(null, arrayDates), // Obtener la fecha máxima.
    };
  };

  const CustomTooltip = ({ active, payload, label }) => { // Componente que muestra información detallada sobre un punto de datos.
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ padding: "20px", opacity: "0.8" }}>
          <Typography gutterBottom>
            {messages[language]?.startDate}: {format(label, "HH:mm dd/MM/yyyy")}
          </Typography>
          <Typography gutterBottom>
            {messages[language]?.difficulty}: {payload[0]?.payload?.dificultad || "-"}
          </Typography>
          <Typography gutterBottom>
            {messages[language]?.game}: {payload[0]?.payload?.juego || "-"}
          </Typography>
          <Typography gutterBottom>
            {messages[language]?.corrects}: {payload[0]?.value}
          </Typography>
          <Typography gutterBottom>
            {messages[language]?.errors}: {payload[1]?.value}
          </Typography>
          <Typography>
            {messages[language]?.accuracyRatio}:{" "}
            {payload[1]?.value === 0
              ? 100
              : Math.round(
                  (payload[0]?.value / (payload[0]?.value + payload[1]?.value)) *
                    100 *
                    100
                ) / 100}{" "}
            %
          </Typography>
        </Paper>
      );
    }

    return null;
  };

  const CustomizedXTick = (props) => {
    const { x, y, stroke, payload } = props;
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} fill="#666">
          <tspan textAnchor="middle" x="0" fontSize={"13px"}>
            {payload.value instanceof Date &&
              format(payload.value, "dd/MM/yyyy")}
          </tspan>
          <tspan textAnchor="middle" x="0" dy="15" fontSize={"12px"}>
            {payload.value instanceof Date && format(payload.value, "HH:mm")}
          </tspan>
        </text>
      </g>
    );
  };

  const renderCustomizedLabel = ({ x, y, name }) => {
    return (
      <text
        x={x}
        y={y}
        fill="black"
        textAnchor="end"
        dominantBaseline="central"
      >
        {name}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        label={renderCustomizedLabel}
        data={filteredStats}
        margin={{
          top: 20,
          bottom: 20,
        }}
      >
        <defs>
          <linearGradient id="colorB" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#1A5E20" stopOpacity={0.9} />
            <stop offset="95%" stopColor="#1A5E20" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorE" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FF0000" stopOpacity={0.9} />
            <stop offset="95%" stopColor="#FF0000" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="x"
          interval={0}
          tick={<CustomizedXTick />}
          domain={[getDomain().min, getDomain().max]}
        />
        <YAxis yAxisId="left" />
        <YAxis
          tickFormatter={(tick) => tick + "%"}
          yAxisId="right"
          orientation="right"
          domain={[0, 100]}
          interval={0}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          verticalAlign="top"
          align="center"
          wrapperStyle={{ paddingBottom: "20px" }}
        />
        <Area
          fillOpacity={1}
          fill="url(#colorB)"
          yAxisId="left"
          name={messages[language]?.corrects}
          type="monotone"
          dataKey="y"
          stroke="#82ca9d"
          activeDot={{ r: 8 }}
        >
          <LabelList stroke="#82ca9d" dataKey="y" position="top" />
        </Area>
        <Area
          fillOpacity={1}
          fill="url(#colorE)"
          yAxisId="left"
          name={messages[language]?.errors}
          type="monotone"
          dataKey="z"
          stroke="#FF0000"
          activeDot={{ r: 8 }}
        >
          <LabelList stroke="#FF0000" dataKey="z" position="top" />
        </Area>
        <Line
          yAxisId="right"
          name={messages[language]?.accuracyRatio}
          type="monotone"
          dataKey="r"
          stroke="#00C1FF"
          activeDot={{ r: 8 }}
        >
          <LabelList
            stroke="#00C1FF"
            dataKey="r"
            position="top"
            formatter={(label) => label + "%"}
          />
        </Line>
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default Chart;