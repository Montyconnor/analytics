import React from "react";
import { Users, FileText, TrendingUp, CheckCircle } from "lucide-react";

interface SummaryData {
  totalParticipants: number;
  activeParticipants: number;
  totalStudies: number;
  activeStudies: number;
  averageEligibilityRate: number;
  completionRate: number;
}

interface SummaryMetricsProps {
  data: SummaryData;
}

const SummaryMetrics: React.FC<SummaryMetricsProps> = ({ data }) => {
  const formatNumber = (num: number) => num.toLocaleString();

  const metrics = [
    {
      label: "Total Participants",
      value: formatNumber(data.totalParticipants),
      icon: Users,
      color: "#3b82f6",
    },
    {
      label: "Active Participants",
      value: formatNumber(data.activeParticipants),
      icon: TrendingUp,
      color: "#10b981",
    },
    {
      label: "Total Studies",
      value: formatNumber(data.totalStudies),
      icon: FileText,
      color: "#f59e0b",
    },
    {
      label: "Active Studies",
      value: formatNumber(data.activeStudies),
      icon: CheckCircle,
      color: "#8b5cf6",
    },
    {
      label: "Avg. Eligibility Rate",
      value: `${data.averageEligibilityRate}%`,
      icon: TrendingUp,
      color: "#ef4444",
    },
    {
      label: "Completion Rate",
      value: `${data.completionRate}%`,
      icon: CheckCircle,
      color: "#06b6d4",
    },
  ];

  return (
    <div className="grid grid-3">
      {metrics.map((metric, index) => (
        <div key={index} className="card">
          <div className="metric">
            <div>
              <div className="metric-label">{metric.label}</div>
              <div className="metric-value">{metric.value}</div>
            </div>
            <metric.icon size={24} color={metric.color} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default React.memo(SummaryMetrics);
