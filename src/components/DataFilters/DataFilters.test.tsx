import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "../../test-utils";
import DataFilters from "./DataFilters";
import { mockFilterOptions } from "../../test-utils";
import { authenticatedFetch } from "../../config";

// Mock the authenticatedFetch function
vi.mock("../../config", () => ({
  authenticatedFetch: vi.fn(),
}));

describe("DataFilters", () => {
  const mockOnFiltersChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock successful API response
    vi.mocked(authenticatedFetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockFilterOptions),
    } as Response);
  });

  it("should render filter toggle button", () => {
    render(<DataFilters onFiltersChange={mockOnFiltersChange} />);

    expect(screen.getByText("Filters")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /filters/i })
    ).toBeInTheDocument();
  });

  it("should render loading state initially", () => {
    render(<DataFilters onFiltersChange={mockOnFiltersChange} />);

    expect(screen.getByText("Loading filter options...")).toBeInTheDocument();
  });

  it("should render with correct CSS classes", () => {
    render(<DataFilters onFiltersChange={mockOnFiltersChange} />);

    const filtersContainer = document.querySelector(".filters-container");
    expect(filtersContainer).toBeInTheDocument();

    const filterHeader = document.querySelector(".filter-header");
    expect(filterHeader).toBeInTheDocument();
  });

  it("should handle API error gracefully", async () => {
    vi.mocked(authenticatedFetch).mockResolvedValue({
      ok: false,
      status: 500,
    } as Response);

    render(<DataFilters onFiltersChange={mockOnFiltersChange} />);

    // Should still render the component without crashing
    expect(screen.getByText("Filters")).toBeInTheDocument();
  });
});
