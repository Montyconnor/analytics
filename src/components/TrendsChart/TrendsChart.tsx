import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface TrendsData {
  timeRanges: {
    [key: string]: {
      interval: string;
      metrics: Array<{
        name: string;
        data: Array<{
          date: string;
          value: number;
        }>;
      }>;
    };
  };
}

interface TrendsChartProps {
  data: TrendsData;
}

const TrendsChart: React.FC<TrendsChartProps> = ({ data }) => {
  const colors = ["#3b82f6", "#10b981", "#f59e0b"];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Get the first available time range data
  const timeRangeKeys = Object.keys(data.timeRanges);
  const timeRangeData = data.timeRanges[timeRangeKeys[0]];

  if (
    !timeRangeData ||
    !timeRangeData.metrics ||
    timeRangeData.metrics.length === 0
  ) {
    return <div>No trend data available</div>;
  }

  // Create a combined dataset with all metrics
  const combinedData = timeRangeData.metrics[0].data.map((item, index) => {
    const dataPoint: any = { date: item.date };
    timeRangeData.metrics.forEach((metric) => {
      if (metric.data[index]) {
        dataPoint[metric.name] = metric.data[index].value;
      }
    });
    return dataPoint;
  });

  return (
    <div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={combinedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip
              labelFormatter={formatDate}
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "0.5rem",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Legend />
            {timeRangeData.metrics.map((metric, index) => (
              <Line
                key={metric.name}
                type="monotone"
                dataKey={metric.name}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{
                  fill: colors[index % colors.length],
                  strokeWidth: 2,
                  r: 4,
                }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default React.memo(TrendsChart);
