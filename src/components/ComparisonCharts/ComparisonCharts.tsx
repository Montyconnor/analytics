import React, { useState } from "react";
import { Split } from "lucide-react";
import PieChart from "../PieChart/PieChart";
import BarChart from "../BarChart/BarChart";

interface ComparisonData {
  studyType: {
    dimension: string;
    metrics: Array<{
      name: string;
      applications: number;
      completions: number;
    }>;
  };
  ageGroup: {
    dimension: string;
    metrics: Array<{
      name: string;
      applications: number;
      completions: number;
    }>;
  };
}

interface ComparisonChartsProps {
  data: ComparisonData;
}

const ComparisonCharts: React.FC<ComparisonChartsProps> = ({ data }) => {
  const [isMerged, setIsMerged] = useState(false);
  const formatNumber = (num: number) => num.toLocaleString();

  // Colors for pie charts
  const pieColors = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ef4444",
    "#06b6d4",
  ];

  // Prepare data for pie charts
  const applicationsByAge = data.ageGroup.metrics.map((metric, index) => ({
    name: metric.name,
    value: metric.applications,
    color: pieColors[index % pieColors.length],
  }));

  const completionsByAge = data.ageGroup.metrics.map((metric, index) => ({
    name: metric.name,
    value: metric.completions,
    color: pieColors[index % pieColors.length],
  }));

  // Prepare merged data for bar chart
  const mergedAgeData = data.ageGroup.metrics.map((metric, index) => ({
    name: metric.name,
    applications: metric.applications,
    completions: metric.completions,
    color: pieColors[index % pieColors.length],
  }));

  // Determine if a specific study type is selected
  const isSpecificStudyTypeSelected = data.studyType.metrics.length === 1;
  const selectedStudyType = isSpecificStudyTypeSelected
    ? data.studyType.metrics[0].name
    : null;

  // Dynamic title based on selection
  const studyTypeTitle = isSpecificStudyTypeSelected
    ? `${selectedStudyType} Performance`
    : "Study Type Performance";

  return (
    <div className="comparison-charts-container">
      {/* Study Type Comparison - Shows all or selected type */}
      <BarChart
        data={data.studyType.metrics}
        title={studyTypeTitle}
        applicationsColor="#3b82f6"
        completionsColor="#10b981"
        formatNumber={formatNumber}
        xAxisAngle={isSpecificStudyTypeSelected ? 0 : -30}
        xAxisHeight={isSpecificStudyTypeSelected ? 60 : 120}
      />

      {/* Age Group Section */}
      {isMerged ? (
        // Merged Bar Chart
        <div className="card merged-age-chart">
          <div className="chart-header">
            <h3>Age Group Performance</h3>
            <button
              onClick={() => setIsMerged(!isMerged)}
              className="chart-toggle-button"
              title="Split Charts"
            >
              <Split size={20} />
            </button>
          </div>
          <BarChart
            data={mergedAgeData}
            title=""
            applicationsColor="#3b82f6"
            completionsColor="#10b981"
            formatNumber={formatNumber}
          />
        </div>
      ) : (
        // Two Separate Pie Charts
        <div className="age-group-section">
          {/* Applications Pie Chart */}
          <PieChart
            data={applicationsByAge}
            title="Applications by Age Group"
            valueLabel="Applications"
            formatNumber={formatNumber}
          />

          {/* Completions Pie Chart */}
          <PieChart
            data={completionsByAge}
            title="Completions by Age Group"
            valueLabel="Completions"
            formatNumber={formatNumber}
          />
        </div>
      )}
    </div>
  );
};

export default React.memo(ComparisonCharts);
