import React from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface BarChartData {
  name: string;
  applications: number;
  completions: number;
}

interface BarChartProps {
  data: BarChartData[];
  title: string;
  applicationsColor?: string;
  completionsColor?: string;
  formatNumber?: (num: number) => string;
  xAxisAngle?: number;
  xAxisHeight?: number;
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  title,
  applicationsColor = "#3b82f6",
  completionsColor = "#10b981",
  formatNumber = (num: number) => num.toLocaleString(),
  xAxisAngle = 0,
  xAxisHeight = 60,
}) => {
  const chartContent = (
    <div className="chart-container" style={{ minHeight: "300px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="name"
            stroke="#6b7280"
            fontSize={11}
            angle={xAxisAngle}
            textAnchor={xAxisAngle !== 0 ? "end" : "middle"}
            height={xAxisHeight}
            interval={0}
            tick={{ fontSize: 11 }}
          />
          <YAxis stroke="#6b7280" fontSize={12} tickFormatter={formatNumber} />
          <Tooltip
            formatter={(value: number) => [formatNumber(value), ""]}
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          />
          <Legend />
          <Bar
            dataKey="applications"
            fill={applicationsColor}
            name="Applications"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="completions"
            fill={completionsColor}
            name="Completions"
            radius={[4, 4, 0, 0]}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );

  // If no title is provided, return just the chart content
  if (!title) {
    return chartContent;
  }

  // Otherwise return the full card with title
  return (
    <div className="card" style={{ marginBottom: "1.5rem", width: "100%" }}>
      <h3>{title}</h3>
      {chartContent}
    </div>
  );
};

export default React.memo(BarChart);
