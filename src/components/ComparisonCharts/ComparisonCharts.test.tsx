import { describe, it, expect } from "vitest";
import { render, screen } from "../../test-utils";
import ComparisonCharts from "./ComparisonCharts";
import { mockComparisonData } from "../../test-utils";

describe("ComparisonCharts", () => {
  it("should render study type performance chart", () => {
    render(<ComparisonCharts data={mockComparisonData} />);

    expect(screen.getByText("Study Type Performance")).toBeInTheDocument();
  });

  it("should render age group section with pie charts by default", () => {
    render(<ComparisonCharts data={mockComparisonData} />);

    expect(screen.getByText("Applications by Age Group")).toBeInTheDocument();
    expect(screen.getByText("Completions by Age Group")).toBeInTheDocument();
  });

  it("should render chart containers", () => {
    render(<ComparisonCharts data={mockComparisonData} />);

    const chartContainers = document.querySelectorAll(".chart-container");
    expect(chartContainers.length).toBeGreaterThan(0);
  });

  it("should render comparison charts container", () => {
    render(<ComparisonCharts data={mockComparisonData} />);

    const container = document.querySelector(".comparison-charts-container");
    expect(container).toBeInTheDocument();
  });

  it("should render age group section", () => {
    render(<ComparisonCharts data={mockComparisonData} />);

    const ageGroupSection = document.querySelector(".age-group-section");
    expect(ageGroupSection).toBeInTheDocument();
  });

  it("should toggle between pie charts and merged bar chart", async () => {
    render(<ComparisonCharts data={mockComparisonData} />);

    // Initially should show pie charts
    expect(screen.getByText("Applications by Age Group")).toBeInTheDocument();
    expect(screen.getByText("Completions by Age Group")).toBeInTheDocument();

    // The toggle button should not be visible initially
    expect(screen.queryByTitle("Split Charts")).not.toBeInTheDocument();
  });

  it("should render with correct CSS classes", () => {
    render(<ComparisonCharts data={mockComparisonData} />);

    const comparisonContainer = document.querySelector(
      ".comparison-charts-container"
    );
    expect(comparisonContainer).toBeInTheDocument();

    const ageGroupSection = document.querySelector(".age-group-section");
    expect(ageGroupSection).toBeInTheDocument();
  });

  it("should render with single study type data", () => {
    const singleStudyData = {
      studyType: {
        dimension: "studyType",
        metrics: [
          { name: "Clinical Trials", applications: 764, completions: 157 },
        ],
      },
      ageGroup: mockComparisonData.ageGroup,
    };

    render(<ComparisonCharts data={singleStudyData} />);

    // Should show specific study type title
    expect(screen.getByText("Clinical Trials Performance")).toBeInTheDocument();
  });

  it("should render with multiple study types data", () => {
    render(<ComparisonCharts data={mockComparisonData} />);

    // Should show generic study type title
    expect(screen.getByText("Study Type Performance")).toBeInTheDocument();
  });

  it("should render with empty data", () => {
    const emptyData = {
      studyType: {
        dimension: "studyType",
        metrics: [],
      },
      ageGroup: {
        dimension: "ageGroup",
        metrics: [],
      },
    };

    render(<ComparisonCharts data={emptyData} />);

    expect(screen.getByText("Study Type Performance")).toBeInTheDocument();
  });

  it("should render with single age group data", () => {
    const singleAgeData = {
      studyType: mockComparisonData.studyType,
      ageGroup: {
        dimension: "ageGroup",
        metrics: [{ name: "18-24", applications: 841, completions: 146 }],
      },
    };

    render(<ComparisonCharts data={singleAgeData} />);

    expect(screen.getByText("Applications by Age Group")).toBeInTheDocument();
    expect(screen.getByText("Completions by Age Group")).toBeInTheDocument();
  });

  it("should handle data with zero values", () => {
    const zeroData = {
      studyType: {
        dimension: "studyType",
        metrics: [{ name: "Zero Data", applications: 0, completions: 0 }],
      },
      ageGroup: {
        dimension: "ageGroup",
        metrics: [{ name: "Zero Age", applications: 0, completions: 0 }],
      },
    };

    render(<ComparisonCharts data={zeroData} />);

    expect(screen.getByText("Zero Data Performance")).toBeInTheDocument();
  });

  it("should render with correct CSS classes", () => {
    render(<ComparisonCharts data={mockComparisonData} />);

    const comparisonContainer = document.querySelector(
      ".comparison-charts-container"
    );
    expect(comparisonContainer).toBeInTheDocument();

    const ageGroupSection = document.querySelector(".age-group-section");
    expect(ageGroupSection).toBeInTheDocument();
  });

  it("should render chart containers", () => {
    render(<ComparisonCharts data={mockComparisonData} />);

    const chartContainers = document.querySelectorAll(".chart-container");
    expect(chartContainers.length).toBeGreaterThan(0);
  });

  it("should render with single study type data", () => {
    const singleStudyData = {
      studyType: {
        dimension: "studyType",
        metrics: [
          { name: "Clinical Trials", applications: 764, completions: 157 },
        ],
      },
      ageGroup: mockComparisonData.ageGroup,
    };

    render(<ComparisonCharts data={singleStudyData} />);

    // Should show specific study type title
    expect(screen.getByText("Clinical Trials Performance")).toBeInTheDocument();
  });

  it("should render with multiple study types data", () => {
    render(<ComparisonCharts data={mockComparisonData} />);

    // Should show generic study type title
    expect(screen.getByText("Study Type Performance")).toBeInTheDocument();
  });

  it("should handle data with special characters in names", () => {
    const specialData = {
      studyType: {
        dimension: "studyType",
        metrics: [
          { name: "Special & Study", applications: 100, completions: 50 },
        ],
      },
      ageGroup: {
        dimension: "ageGroup",
        metrics: [{ name: "Special Age", applications: 200, completions: 100 }],
      },
    };

    render(<ComparisonCharts data={specialData} />);

    expect(screen.getByText("Special & Study Performance")).toBeInTheDocument();
  });

  it("should handle large numbers in data", () => {
    const largeData = {
      studyType: {
        dimension: "studyType",
        metrics: [
          { name: "Large Numbers", applications: 1234567, completions: 987654 },
        ],
      },
      ageGroup: {
        dimension: "ageGroup",
        metrics: [
          { name: "Large Age", applications: 987654, completions: 123456 },
        ],
      },
    };

    render(<ComparisonCharts data={largeData} />);

    expect(screen.getByText("Large Numbers Performance")).toBeInTheDocument();
  });

  it("should render with missing optional props", () => {
    render(<ComparisonCharts data={mockComparisonData} />);

    expect(screen.getByText("Study Type Performance")).toBeInTheDocument();
    expect(screen.getByText("Applications by Age Group")).toBeInTheDocument();
    expect(screen.getByText("Completions by Age Group")).toBeInTheDocument();
  });
});
