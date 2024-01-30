import { useActor } from "@xstate/react";
import {
  Bar,
  BarChart,
  Label,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useTheme } from "@/lib/hooks/useTheme";
import { splitCamelCase, titleCase } from "@/lib/utils";
import { useGlobalActors } from "@/globalState";

import { dataLogic } from "./actors";
import { ChartTooltip } from "./chart-tooltip";

export function StockOverview() {
  const { theme } = useTheme();
  const { branchActor } = useGlobalActors();

  const [{ context: data }] = useActor(dataLogic, {
    input: {
      branchActor,
    },
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ bottom: 50 }}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          angle={45}
          dx={15}
          dy={36}
          minTickGap={-200}
          padding={{ right: 40 }}
        >
          <Label
            value="Ingredients"
            fontSize={12}
            offset={0}
            position="center"
            style={{
              fill: theme === "light" ? "#09090b" : "#fafafa",
            }}
          />
        </XAxis>
        <YAxis stroke="#888888" fontSize={12} transform="translate(-4, 0)">
          <Label
            angle={-90}
            value="Stock"
            fontSize={12}
            offset={15}
            position="insideLeft"
            style={{
              fill: theme === "light" ? "#09090b" : "#fafafa",
            }}
          />
        </YAxis>
        <Bar dataKey="excess" fill="#fafafa" stackId="a" />
        <Bar dataKey="current" fill="#22c55e" stackId="a" />
        <Bar dataKey="inMenu" fill="#ef4444" stackId="a" />
        <Tooltip
          cursor={{
            fill: theme === "light" ? "#27272a" : "#e4e4e7",
            fillOpacity: 0.5,
            radius: 4,
            stroke: theme === "light" ? "#27272a" : "#e4e4e7",
            strokeWidth: 2,
          }}
          content={ChartTooltip}
        />
        <Legend
          verticalAlign="top"
          height={36}
          formatter={(value: string, entry) => {
            const { color } = entry;

            return (
              <span style={{ color }}>{titleCase(splitCamelCase(value))}</span>
            );
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
