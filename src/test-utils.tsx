import React from "react";
import { render, RenderOptions } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

// Test data for components
export const mockSummaryData = {
  totalParticipants: 1722,
  activeParticipants: 1205,
  totalStudies: 6,
  activeStudies: 3,
  averageEligibilityRate: 85.1,
  completionRate: 17.5,
};

export const mockTrendsData = {
  timeRanges: {
    "30d": {
      interval: "day",
      metrics: [
        {
          name: "Study Applications",
          data: [
            { date: "2024-01-01", value: 100 },
            { date: "2024-01-02", value: 150 },
            { date: "2024-01-03", value: 120 },
          ],
        },
        {
          name: "Study Completions",
          data: [
            { date: "2024-01-01", value: 80 },
            { date: "2024-01-02", value: 120 },
            { date: "2024-01-03", value: 95 },
          ],
        },
      ],
    },
  },
};

export const mockComparisonData = {
  studyType: {
    dimension: "studyType",
    metrics: [
      { name: "Clinical Trials", applications: 764, completions: 157 },
      { name: "Surveys", applications: 983, completions: 189 },
      { name: "Focus Groups", applications: 847, completions: 138 },
    ],
  },
  ageGroup: {
    dimension: "ageGroup",
    metrics: [
      { name: "18-24", applications: 841, completions: 146 },
      { name: "25-34", applications: 729, completions: 106 },
      { name: "35-44", applications: 874, completions: 165 },
    ],
  },
};

export const mockFilterOptions = {
  studyTypes: ["Clinical Trials", "Surveys", "Focus Groups"],
  ageGroups: ["18-24", "25-34", "35-44"],
  regions: ["North America", "Europe", "Asia"],
  timeRanges: ["7d", "14d", "30d"],
};

// Custom render function with Router
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <BrowserRouter>{children}</BrowserRouter>;
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from "@testing-library/react";
export { customRender as render };
