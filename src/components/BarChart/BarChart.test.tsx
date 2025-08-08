import { describe, it, expect } from "vitest";
import { render, screen } from "../../test-utils";
import BarChart from "./BarChart";

const mockBarData = [
  { name: "Clinical Trials", applications: 764, completions: 157 },
  { name: "Surveys", applications: 983, completions: 189 },
  { name: "Focus Groups", applications: 847, completions: 138 },
];

describe("BarChart", () => {
  it("should render chart title", () => {
    render(
      <BarChart
        data={mockBarData}
        title="Study Type Performance"
        applicationsColor="#3b82f6"
        completionsColor="#10b981"
      />
    );

    expect(screen.getByText("Study Type Performance")).toBeInTheDocument();
  });

  it("should render chart container", () => {
    render(
      <BarChart
        data={mockBarData}
        title="Study Type Performance"
        applicationsColor="#3b82f6"
        completionsColor="#10b981"
      />
    );

    const chartContainer = document.querySelector(".chart-container");
    expect(chartContainer).toBeInTheDocument();
  });

  it("should render with empty data", () => {
    render(
      <BarChart
        data={[]}
        title="Empty Chart"
        applicationsColor="#3b82f6"
        completionsColor="#10b981"
      />
    );

    expect(screen.getByText("Empty Chart")).toBeInTheDocument();
    const chartContainer = document.querySelector(".chart-container");
    expect(chartContainer).toBeInTheDocument();
  });

  it("should render with single data point", () => {
    const singleData = [{ name: "Test", applications: 100, completions: 50 }];

    render(
      <BarChart
        data={singleData}
        title="Single Data Point"
        applicationsColor="#3b82f6"
        completionsColor="#10b981"
      />
    );

    expect(screen.getByText("Single Data Point")).toBeInTheDocument();
    const chartContainer = document.querySelector(".chart-container");
    expect(chartContainer).toBeInTheDocument();
  });

  it("should render with custom colors", () => {
    render(
      <BarChart
        data={mockBarData}
        title="Custom Colors"
        applicationsColor="#ff0000"
        completionsColor="#00ff00"
      />
    );

    expect(screen.getByText("Custom Colors")).toBeInTheDocument();
  });

  it("should render with custom number formatting", () => {
    const customFormatNumber = (num: number) => `$${num.toLocaleString()}`;

    render(
      <BarChart
        data={mockBarData}
        title="Custom Formatting"
        applicationsColor="#3b82f6"
        completionsColor="#10b981"
        formatNumber={customFormatNumber}
      />
    );

    expect(screen.getByText("Custom Formatting")).toBeInTheDocument();
  });

  it("should render with custom x-axis angle", () => {
    render(
      <BarChart
        data={mockBarData}
        title="Angled Labels"
        applicationsColor="#3b82f6"
        completionsColor="#10b981"
        xAxisAngle={-45}
      />
    );

    expect(screen.getByText("Angled Labels")).toBeInTheDocument();
  });

  it("should render with custom x-axis height", () => {
    render(
      <BarChart
        data={mockBarData}
        title="Custom Height"
        applicationsColor="#3b82f6"
        completionsColor="#10b981"
        xAxisHeight={150}
      />
    );

    expect(screen.getByText("Custom Height")).toBeInTheDocument();
  });

  it("should handle data with zero values", () => {
    const zeroData = [
      { name: "Zero Apps", applications: 0, completions: 50 },
      { name: "Zero Completions", applications: 100, completions: 0 },
      { name: "Both Zero", applications: 0, completions: 0 },
    ];

    render(
      <BarChart
        data={zeroData}
        title="Zero Values"
        applicationsColor="#3b82f6"
        completionsColor="#10b981"
      />
    );

    expect(screen.getByText("Zero Values")).toBeInTheDocument();
    const chartContainer = document.querySelector(".chart-container");
    expect(chartContainer).toBeInTheDocument();
  });

  it("should handle large numbers", () => {
    const largeData = [
      { name: "Large Numbers", applications: 1234567, completions: 987654 },
    ];

    render(
      <BarChart
        data={largeData}
        title="Large Numbers"
        applicationsColor="#3b82f6"
        completionsColor="#10b981"
      />
    );

    expect(screen.getByText("Large Numbers")).toBeInTheDocument();
  });

  it("should render with correct CSS classes", () => {
    render(
      <BarChart
        data={mockBarData}
        title="CSS Classes"
        applicationsColor="#3b82f6"
        completionsColor="#10b981"
      />
    );

    const card = document.querySelector(".card");
    expect(card).toBeInTheDocument();

    const chartContainer = document.querySelector(".chart-container");
    expect(chartContainer).toBeInTheDocument();
  });

  it("should handle missing optional props", () => {
    render(
      <BarChart
        data={mockBarData}
        title="Missing Props"
        applicationsColor="#3b82f6"
        completionsColor="#10b981"
      />
    );

    expect(screen.getByText("Missing Props")).toBeInTheDocument();
    const chartContainer = document.querySelector(".chart-container");
    expect(chartContainer).toBeInTheDocument();
  });

  it("should handle data with special characters in names", () => {
    const specialData = [
      { name: "Test & More", applications: 100, completions: 50 },
      { name: "Special/Chars", applications: 200, completions: 75 },
      { name: "Unicode: 测试", applications: 150, completions: 60 },
    ];

    render(
      <BarChart
        data={specialData}
        title="Special Characters"
        applicationsColor="#3b82f6"
        completionsColor="#10b981"
      />
    );

    expect(screen.getByText("Special Characters")).toBeInTheDocument();
  });
});
