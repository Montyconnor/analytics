import React from "react";
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip } from "recharts";

interface PieChartData {
  name: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: PieChartData[];
  title: string;
  valueLabel: string;
  formatNumber?: (num: number) => string;
}

const PieChart: React.FC<PieChartProps> = ({
  data,
  title,
  valueLabel,
  formatNumber = (num: number) => num.toLocaleString(),
}) => {
  // Calculate total for percentage calculations
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Custom tooltip to show both value and percentage
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage =
        total > 0 ? ((data.value / total) * 100).toFixed(1) : "0.0";

      return (
        <div
          style={{
            backgroundColor: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "0.5rem",
            padding: "0.75rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        >
          <p
            style={{
              margin: "0 0 0.25rem 0",
              fontWeight: "bold",
              color: "#374151",
            }}
          >
            {data.name}
          </p>
          <p style={{ margin: "0", color: "#6b7280" }}>
            {valueLabel}: {formatNumber(data.value)}
          </p>
          <p style={{ margin: "0", color: "#6b7280" }}>
            Percentage: {percentage}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className="card"
      style={{
        marginBottom: "1.5rem",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h3>{title}</h3>
      <div
        className="pie-chart-container"
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "1rem",
          flexDirection: "row",
          flex: 1,
        }}
      >
        <div
          className="chart-container"
          style={{
            flex: "0 0 auto",
            width: "200px",
            minHeight: "300px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {data.length > 0 ? (
            <RechartsPieChart width={200} height={200}>
              <Pie
                data={data}
                cx={100}
                cy={100}
                outerRadius={80}
                dataKey="value"
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </RechartsPieChart>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                color: "#6b7280",
              }}
            >
              No data available
            </div>
          )}
        </div>
        <div
          className="legend-container"
          style={{ flex: "0 0 auto", paddingTop: "1rem", width: "100%" }}
        >
          {data.map((entry, index) => {
            const percentage =
              total > 0 ? ((entry.value / total) * 100).toFixed(1) : "0.0";
            return (
              <div
                key={index}
                className="legend-item"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "0.5rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    className="legend-color"
                    style={{
                      width: "12px",
                      height: "12px",
                      backgroundColor: entry.color,
                      borderRadius: "2px",
                      marginRight: "0.5rem",
                    }}
                  />
                  <span style={{ fontSize: "0.875rem", color: "#374151" }}>
                    {entry.name}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "#9ca3af",
                      fontWeight: "bold",
                      paddingLeft: 8,
                    }}
                  >
                    ({percentage}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default React.memo(PieChart);
