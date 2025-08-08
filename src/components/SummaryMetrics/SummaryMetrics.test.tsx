import { describe, it, expect } from "vitest";
import { render, screen } from "../../test-utils";
import SummaryMetrics from "./SummaryMetrics";
import { mockSummaryData } from "../../test-utils";

describe("SummaryMetrics", () => {
  it("should render all summary metrics", () => {
    render(<SummaryMetrics data={mockSummaryData} />);

    // Check that all metrics are displayed
    expect(screen.getByText("Total Participants")).toBeInTheDocument();
    expect(screen.getByText("1,722")).toBeInTheDocument();

    expect(screen.getByText("Active Participants")).toBeInTheDocument();
    expect(screen.getByText("1,205")).toBeInTheDocument();

    expect(screen.getByText("Total Studies")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();

    expect(screen.getByText("Active Studies")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();

    expect(screen.getByText("Avg. Eligibility Rate")).toBeInTheDocument();
    expect(screen.getByText("85.1%")).toBeInTheDocument();

    expect(screen.getByText("Completion Rate")).toBeInTheDocument();
    expect(screen.getByText("17.5%")).toBeInTheDocument();
  });

  it("should render with zero values", () => {
    const zeroData = {
      totalParticipants: 0,
      activeParticipants: 0,
      totalStudies: 0,
      activeStudies: 0,
      averageEligibilityRate: 0,
      completionRate: 0,
    };

    render(<SummaryMetrics data={zeroData} />);

    expect(screen.getAllByText("0")).toHaveLength(4);
    expect(screen.getAllByText("0%")).toHaveLength(2);
  });

  it("should format large numbers correctly", () => {
    const largeData = {
      totalParticipants: 1234567,
      activeParticipants: 987654,
      totalStudies: 1234,
      activeStudies: 567,
      averageEligibilityRate: 95.5,
      completionRate: 23.7,
    };

    render(<SummaryMetrics data={largeData} />);

    expect(screen.getByText("1,234,567")).toBeInTheDocument();
    expect(screen.getByText("987,654")).toBeInTheDocument();
    expect(screen.getByText("1,234")).toBeInTheDocument();
    expect(screen.getByText("567")).toBeInTheDocument();
    expect(screen.getByText("95.5%")).toBeInTheDocument();
    expect(screen.getByText("23.7%")).toBeInTheDocument();
  });

  it("should handle decimal percentages correctly", () => {
    const decimalData = {
      totalParticipants: 100,
      activeParticipants: 70,
      totalStudies: 5,
      activeStudies: 3,
      averageEligibilityRate: 87.3,
      completionRate: 12.8,
    };

    render(<SummaryMetrics data={decimalData} />);

    expect(screen.getByText("87.3%")).toBeInTheDocument();
    expect(screen.getByText("12.8%")).toBeInTheDocument();
  });

  it("should render with correct CSS classes", () => {
    render(<SummaryMetrics data={mockSummaryData} />);

    // Check that the grid container has the correct class
    const gridContainer = screen
      .getByText("Total Participants")
      .closest(".grid-3");
    expect(gridContainer).toBeInTheDocument();

    // Check that metric cards have the correct class
    const metricCards = document.querySelectorAll(".card");
    expect(metricCards).toHaveLength(6);
  });

  it("should display metric labels correctly", () => {
    render(<SummaryMetrics data={mockSummaryData} />);

    const labels = [
      "Total Participants",
      "Active Participants",
      "Total Studies",
      "Active Studies",
      "Avg. Eligibility Rate",
      "Completion Rate",
    ];

    labels.forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it("should handle missing data gracefully", () => {
    const incompleteData = {
      totalParticipants: 100,
      activeParticipants: 70,
      totalStudies: 0,
      activeStudies: 0,
      averageEligibilityRate: 0,
      completionRate: 0,
    };

    render(<SummaryMetrics data={incompleteData} />);

    // Should still render what's available
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("70")).toBeInTheDocument();
  });
});
