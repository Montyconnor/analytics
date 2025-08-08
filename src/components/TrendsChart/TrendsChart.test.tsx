import { describe, it, expect } from "vitest";
import { render, screen } from "../../test-utils";
import TrendsChart from "./TrendsChart";
import { mockTrendsData } from "../../test-utils";

describe("TrendsChart", () => {
  it("should render chart container", () => {
    render(<TrendsChart data={mockTrendsData} />);

    const chartContainer = document.querySelector(".chart-container");
    expect(chartContainer).toBeInTheDocument();
  });

  it("should render chart container", () => {
    render(<TrendsChart data={mockTrendsData} />);

    const chartContainer = document.querySelector(".chart-container");
    expect(chartContainer).toBeInTheDocument();
  });

  it("should render with empty data", () => {
    const emptyData = {
      timeRanges: {
        "30d": {
          interval: "day",
          metrics: [],
        },
      },
    };

    render(<TrendsChart data={emptyData} />);

    expect(screen.getByText("No trend data available")).toBeInTheDocument();
  });

  it("should render with single metric", () => {
    const singleMetricData = {
      timeRanges: {
        "30d": {
          interval: "day",
          metrics: [
            {
              name: "Single Metric",
              data: [
                { date: "2024-01-01", value: 100 },
                { date: "2024-01-02", value: 150 },
              ],
            },
          ],
        },
      },
    };

    render(<TrendsChart data={singleMetricData} />);

    const chartContainer = document.querySelector(".chart-container");
    expect(chartContainer).toBeInTheDocument();
  });

  it("should render with multiple metrics", () => {
    render(<TrendsChart data={mockTrendsData} />);

    const chartContainer = document.querySelector(".chart-container");
    expect(chartContainer).toBeInTheDocument();
  });

  it("should handle data with zero values", () => {
    const zeroData = {
      timeRanges: {
        "30d": {
          interval: "day",
          metrics: [
            {
              name: "Zero Values",
              data: [
                { date: "2024-01-01", value: 0 },
                { date: "2024-01-02", value: 0 },
              ],
            },
          ],
        },
      },
    };

    render(<TrendsChart data={zeroData} />);

    const chartContainer = document.querySelector(".chart-container");
    expect(chartContainer).toBeInTheDocument();
  });

  it("should handle data with large numbers", () => {
    const largeData = {
      timeRanges: {
        "30d": {
          interval: "day",
          metrics: [
            {
              name: "Large Numbers",
              data: [
                { date: "2024-01-01", value: 1234567 },
                { date: "2024-01-02", value: 987654 },
              ],
            },
          ],
        },
      },
    };

    render(<TrendsChart data={largeData} />);

    const chartContainer = document.querySelector(".chart-container");
    expect(chartContainer).toBeInTheDocument();
  });

  it("should render with correct CSS classes", () => {
    render(<TrendsChart data={mockTrendsData} />);

    const chartContainer = document.querySelector(".chart-container");
    expect(chartContainer).toBeInTheDocument();
  });

  it("should handle different time intervals", () => {
    const weeklyData = {
      timeRanges: {
        "30d": {
          interval: "week",
          metrics: [
            {
              name: "Weekly Data",
              data: [
                { date: "2024-01-01", value: 100 },
                { date: "2024-01-08", value: 150 },
              ],
            },
          ],
        },
      },
    };

    render(<TrendsChart data={weeklyData} />);

    const chartContainer = document.querySelector(".chart-container");
    expect(chartContainer).toBeInTheDocument();
  });

  it("should handle data with decimal values", () => {
    const decimalData = {
      timeRanges: {
        "30d": {
          interval: "day",
          metrics: [
            {
              name: "Decimal Values",
              data: [
                { date: "2024-01-01", value: 123.45 },
                { date: "2024-01-02", value: 456.78 },
              ],
            },
          ],
        },
      },
    };

    render(<TrendsChart data={decimalData} />);

    const chartContainer = document.querySelector(".chart-container");
    expect(chartContainer).toBeInTheDocument();
  });

  it("should handle data with special characters in metric names", () => {
    const specialData = {
      timeRanges: {
        "30d": {
          interval: "day",
          metrics: [
            {
              name: "Special & Characters",
              data: [
                { date: "2024-01-01", value: 100 },
                { date: "2024-01-02", value: 150 },
              ],
            },
            {
              name: "Unicode: 测试",
              data: [
                { date: "2024-01-01", value: 200 },
                { date: "2024-01-02", value: 250 },
              ],
            },
          ],
        },
      },
    };

    render(<TrendsChart data={specialData} />);

    const chartContainer = document.querySelector(".chart-container");
    expect(chartContainer).toBeInTheDocument();
  });

  it("should handle data with missing timeRanges", () => {
    const incompleteData = {
      timeRanges: {},
    };

    render(<TrendsChart data={incompleteData} />);

    expect(screen.getByText("No trend data available")).toBeInTheDocument();
  });

  it("should handle data with missing metrics", () => {
    const noMetricsData = {
      timeRanges: {
        "30d": {
          interval: "day",
          metrics: [],
        },
      },
    };

    render(<TrendsChart data={noMetricsData} />);

    expect(screen.getByText("No trend data available")).toBeInTheDocument();
  });

  it("should handle data with single data point per metric", () => {
    const singlePointData = {
      timeRanges: {
        "30d": {
          interval: "day",
          metrics: [
            {
              name: "Single Point",
              data: [{ date: "2024-01-01", value: 100 }],
            },
          ],
        },
      },
    };

    render(<TrendsChart data={singlePointData} />);

    const chartContainer = document.querySelector(".chart-container");
    expect(chartContainer).toBeInTheDocument();
  });

  it("should handle data with many data points", () => {
    const manyPointsData = {
      timeRanges: {
        "30d": {
          interval: "day",
          metrics: [
            {
              name: "Many Points",
              data: Array.from({ length: 30 }, (_, i) => ({
                date: `2024-01-${String(i + 1).padStart(2, "0")}`,
                value: Math.floor(Math.random() * 1000),
              })),
            },
          ],
        },
      },
    };

    render(<TrendsChart data={manyPointsData} />);

    const chartContainer = document.querySelector(".chart-container");
    expect(chartContainer).toBeInTheDocument();
  });
});
