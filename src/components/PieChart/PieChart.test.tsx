import { describe, it, expect } from "vitest";
import { render, screen } from "../../test-utils";
import PieChart from "./PieChart";

const mockPieData = [
  { name: "18-24", value: 841, color: "#3b82f6" },
  { name: "25-34", value: 729, color: "#10b981" },
  { name: "35-44", value: 874, color: "#f59e0b" },
];

describe("PieChart", () => {
  it("should render chart title", () => {
    render(
      <PieChart
        data={mockPieData}
        title="Age Group Distribution"
        valueLabel="Applications"
      />
    );

    expect(screen.getByText("Age Group Distribution")).toBeInTheDocument();
  });

  it("should render chart container", () => {
    render(
      <PieChart
        data={mockPieData}
        title="Age Group Distribution"
        valueLabel="Applications"
      />
    );

    const chartContainer = document.querySelector(".chart-container");
    expect(chartContainer).toBeInTheDocument();
  });

  it("should render legend container", () => {
    render(
      <PieChart
        data={mockPieData}
        title="Age Group Distribution"
        valueLabel="Applications"
      />
    );

    const legendContainer = document.querySelector(".legend-container");
    expect(legendContainer).toBeInTheDocument();
  });

  it("should render legend items", () => {
    render(
      <PieChart
        data={mockPieData}
        title="Age Group Distribution"
        valueLabel="Applications"
      />
    );

    // Check that legend items are rendered
    expect(screen.getByText("18-24")).toBeInTheDocument();
    expect(screen.getByText("25-34")).toBeInTheDocument();
    expect(screen.getByText("35-44")).toBeInTheDocument();
  });

  it("should render with empty data", () => {
    render(
      <PieChart data={[]} title="Empty Chart" valueLabel="Applications" />
    );

    expect(screen.getByText("Empty Chart")).toBeInTheDocument();
    const chartContainer = document.querySelector(".chart-container");
    expect(chartContainer).toBeInTheDocument();
  });

  it("should render with single data point", () => {
    const singleData = [{ name: "Test", value: 100, color: "#3b82f6" }];

    render(
      <PieChart
        data={singleData}
        title="Single Data Point"
        valueLabel="Applications"
      />
    );

    expect(screen.getByText("Single Data Point")).toBeInTheDocument();
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("should render with custom number formatting", () => {
    const customFormatNumber = (num: number) => `$${num.toLocaleString()}`;

    render(
      <PieChart
        data={mockPieData}
        title="Custom Formatting"
        valueLabel="Applications"
        formatNumber={customFormatNumber}
      />
    );

    expect(screen.getByText("Custom Formatting")).toBeInTheDocument();
  });

  it("should handle data with zero values", () => {
    const zeroData = [
      { name: "Zero Value", value: 0, color: "#3b82f6" },
      { name: "Non Zero", value: 100, color: "#10b981" },
    ];

    render(
      <PieChart data={zeroData} title="Zero Values" valueLabel="Applications" />
    );

    expect(screen.getByText("Zero Values")).toBeInTheDocument();
    expect(screen.getByText("Zero Value")).toBeInTheDocument();
    expect(screen.getByText("Non Zero")).toBeInTheDocument();
  });

  it("should handle large numbers", () => {
    const largeData = [
      { name: "Large Number", value: 1234567, color: "#3b82f6" },
    ];

    render(
      <PieChart
        data={largeData}
        title="Large Numbers"
        valueLabel="Applications"
      />
    );

    expect(screen.getByText("Large Numbers")).toBeInTheDocument();
    expect(screen.getByText("Large Number")).toBeInTheDocument();
  });

  it("should render with correct CSS classes", () => {
    render(
      <PieChart
        data={mockPieData}
        title="CSS Classes"
        valueLabel="Applications"
      />
    );

    const card = document.querySelector(".card");
    expect(card).toBeInTheDocument();

    const chartContainer = document.querySelector(".chart-container");
    expect(chartContainer).toBeInTheDocument();

    const legendContainer = document.querySelector(".legend-container");
    expect(legendContainer).toBeInTheDocument();
  });

  it("should render pie chart container", () => {
    render(
      <PieChart
        data={mockPieData}
        title="Pie Chart Container"
        valueLabel="Applications"
      />
    );

    const pieChartContainer = document.querySelector(".pie-chart-container");
    expect(pieChartContainer).toBeInTheDocument();
  });

  it("should handle data with special characters in names", () => {
    const specialData = [
      { name: "Test & More", value: 100, color: "#3b82f6" },
      { name: "Special/Chars", value: 200, color: "#10b981" },
      { name: "Unicode: 测试", value: 150, color: "#f59e0b" },
    ];

    render(
      <PieChart
        data={specialData}
        title="Special Characters"
        valueLabel="Applications"
      />
    );

    expect(screen.getByText("Special Characters")).toBeInTheDocument();
    expect(screen.getByText("Test & More")).toBeInTheDocument();
    expect(screen.getByText("Special/Chars")).toBeInTheDocument();
    expect(screen.getByText("Unicode: 测试")).toBeInTheDocument();
  });

  it("should render legend colors", () => {
    render(
      <PieChart
        data={mockPieData}
        title="Legend Colors"
        valueLabel="Applications"
      />
    );

    const legendColors = document.querySelectorAll(".legend-color");
    expect(legendColors).toHaveLength(3);
  });

  it("should handle missing optional props", () => {
    render(
      <PieChart
        data={mockPieData}
        title="Missing Props"
        valueLabel="Applications"
      />
    );

    expect(screen.getByText("Missing Props")).toBeInTheDocument();
    const chartContainer = document.querySelector(".chart-container");
    expect(chartContainer).toBeInTheDocument();
  });

  it("should render value labels in legend", () => {
    render(
      <PieChart
        data={mockPieData}
        title="Value Labels"
        valueLabel="Applications"
      />
    );

    // Check that the legend items are rendered
    expect(screen.getByText("18-24")).toBeInTheDocument();
    expect(screen.getByText("25-34")).toBeInTheDocument();
    expect(screen.getByText("35-44")).toBeInTheDocument();
  });

  it("should handle data with decimal values", () => {
    const decimalData = [
      { name: "Decimal", value: 123.45, color: "#3b82f6" },
      { name: "Integer", value: 456, color: "#10b981" },
    ];

    render(
      <PieChart
        data={decimalData}
        title="Decimal Values"
        valueLabel="Applications"
      />
    );

    expect(screen.getByText("Decimal Values")).toBeInTheDocument();
    expect(screen.getByText("Decimal")).toBeInTheDocument();
    expect(screen.getByText("Integer")).toBeInTheDocument();
  });
});
