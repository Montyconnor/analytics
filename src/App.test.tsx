import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "./test-utils";
import App from "./App";
import { authenticatedFetch } from "./config";

// Mock the authenticatedFetch function
vi.mock("./config", () => ({
  authenticatedFetch: vi.fn(),
}));

// Mock the components to avoid chart rendering issues in tests
vi.mock("./components/SummaryMetrics/SummaryMetrics", () => ({
  default: ({ data }: any) => (
    <div data-testid="summary-metrics">
      <div>Total Participants: {data?.totalParticipants || 0}</div>
      <div>Active Participants: {data?.activeParticipants || 0}</div>
      <div>Total Studies: {data?.totalStudies || 0}</div>
      <div>Active Studies: {data?.activeStudies || 0}</div>
      <div>Eligibility Rate: {data?.averageEligibilityRate || 0}%</div>
      <div>Completion Rate: {data?.completionRate || 0}%</div>
    </div>
  ),
}));

vi.mock("./components/TrendsChart/TrendsChart", () => ({
  default: () => <div data-testid="trends-chart">Trends Chart</div>,
}));

vi.mock("./components/ComparisonCharts/ComparisonCharts", () => ({
  default: () => <div data-testid="comparison-charts">Comparison Charts</div>,
}));

vi.mock("./components/DataFilters/DataFilters", () => ({
  default: () => <div data-testid="data-filters">Data Filters</div>,
}));

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock successful API responses
    vi.mocked(authenticatedFetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    } as Response);
  });

  it("should render the main header", () => {
    render(<App />);

    expect(
      screen.getByText("Research Analytics Dashboard")
    ).toBeInTheDocument();
  });

  it("should render the header with correct styling", () => {
    render(<App />);

    const header = screen
      .getByText("Research Analytics Dashboard")
      .closest("header");
    expect(header).toHaveClass("header");
  });

  it("should render the main dashboard container", () => {
    render(<App />);

    const dashboard = document.querySelector(".dashboard");
    expect(dashboard).toBeInTheDocument();
  });

  it("should render the main container", () => {
    render(<App />);

    const container = document.querySelector(".container");
    expect(container).toBeInTheDocument();
  });

  it("should render data filters component", () => {
    render(<App />);

    expect(screen.getByTestId("data-filters")).toBeInTheDocument();
  });

  it("should render loading state initially", () => {
    render(<App />);

    expect(screen.getByText("Loading dashboard data...")).toBeInTheDocument();
  });

  it("should render summary metrics when data loads", async () => {
    vi.mocked(authenticatedFetch).mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          totalParticipants: 1722,
          activeParticipants: 1205,
          totalStudies: 6,
          activeStudies: 3,
          averageEligibilityRate: 85.1,
          completionRate: 17.5,
        }),
    } as Response);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId("summary-metrics")).toBeInTheDocument();
    });

    expect(screen.getByText("Total Participants: 1722")).toBeInTheDocument();
    expect(screen.getByText("Active Participants: 1205")).toBeInTheDocument();
    expect(screen.getByText("Total Studies: 6")).toBeInTheDocument();
    expect(screen.getByText("Active Studies: 3")).toBeInTheDocument();
    expect(screen.getByText("Eligibility Rate: 85.1%")).toBeInTheDocument();
    expect(screen.getByText("Completion Rate: 17.5%")).toBeInTheDocument();
  });

  it("should render trends chart when data loads", async () => {
    vi.mocked(authenticatedFetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    } as Response);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId("trends-chart")).toBeInTheDocument();
    });
  });

  it("should render comparison charts when data loads", async () => {
    vi.mocked(authenticatedFetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    } as Response);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId("comparison-charts")).toBeInTheDocument();
    });
  });

  it("should handle API errors gracefully", async () => {
    vi.mocked(authenticatedFetch).mockResolvedValue({
      ok: false,
      status: 500,
    } as Response);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Error")).toBeInTheDocument();
      expect(screen.getByText("Failed to fetch data")).toBeInTheDocument();
    });
  });

  it("should handle network errors", async () => {
    vi.mocked(authenticatedFetch).mockRejectedValue(new Error("Network error"));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Error")).toBeInTheDocument();
      expect(screen.getByText("Network error")).toBeInTheDocument();
    });
  });

  it("should render with correct CSS classes", () => {
    render(<App />);

    const appContainer = document.querySelector(".App");
    expect(appContainer).toBeInTheDocument();

    const header = document.querySelector(".header");
    expect(header).toBeInTheDocument();

    const dashboard = document.querySelector(".dashboard");
    expect(dashboard).toBeInTheDocument();
  });

  it("should render the app with proper structure", () => {
    render(<App />);

    // Check the overall structure
    const app = document.querySelector(".App");
    expect(app).toBeInTheDocument();

    const header = app?.querySelector(".header");
    expect(header).toBeInTheDocument();

    const dashboard = app?.querySelector(".dashboard");
    expect(dashboard).toBeInTheDocument();

    const container = dashboard?.querySelector(".container");
    expect(container).toBeInTheDocument();
  });

  it("should render loading state with correct styling", () => {
    render(<App />);

    const loadingElement = screen.getByText("Loading dashboard data...");
    expect(loadingElement).toBeInTheDocument();

    const loadingContainer = loadingElement.closest(".loading");
    expect(loadingContainer).toBeInTheDocument();
  });

  it("should render error state with correct styling", async () => {
    vi.mocked(authenticatedFetch).mockResolvedValue({
      ok: false,
      status: 500,
    } as Response);

    render(<App />);

    await waitFor(() => {
      const errorElement = screen.getByText("Error");
      expect(errorElement).toBeInTheDocument();

      const errorContainer = errorElement.closest(".error");
      expect(errorContainer).toBeInTheDocument();
    });
  });
});
