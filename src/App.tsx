import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import SummaryMetrics from "./components/SummaryMetrics/SummaryMetrics";
import TrendsChart from "./components/TrendsChart/TrendsChart";
import ComparisonCharts from "./components/ComparisonCharts/ComparisonCharts";
import DataFilters from "./components/DataFilters/DataFilters";
import { authenticatedFetch } from "./config";

interface SummaryData {
  totalParticipants: number;
  activeParticipants: number;
  totalStudies: number;
  activeStudies: number;
  averageEligibilityRate: number;
  completionRate: number;
}

interface TrendsData {
  timeRanges: {
    [key: string]: {
      interval: string;
      metrics: Array<{
        name: string;
        data: Array<{
          date: string;
          value: number;
        }>;
      }>;
    };
  };
}

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

interface Filters {
  timeRange: string;
  studyType: string;
  ageGroup: string;
  region: string;
}

// Memoized data components to prevent unnecessary re-renders
const MemoizedSummaryMetrics = React.memo(SummaryMetrics);
const MemoizedTrendsChart = React.memo(TrendsChart);
const MemoizedComparisonCharts = React.memo(ComparisonCharts);

// Separate component for data display to isolate re-renders
const DataDisplay: React.FC<{
  summaryData: SummaryData | null;
  trendsData: TrendsData | null;
  comparisonData: ComparisonData | null;
  loading: boolean;
  error: string | null;
}> = React.memo(
  ({ summaryData, trendsData, comparisonData, loading, error }) => {
    if (loading) {
      return (
        <div className="loading">
          <div>Loading dashboard data...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="container">
          <div className="error">
            <h3>Error</h3>
            <p>{error}</p>
          </div>
        </div>
      );
    }

    return (
      <>
        {summaryData && <MemoizedSummaryMetrics data={summaryData} />}

        {trendsData && (
          <div className="card" style={{ marginBottom: 32 }}>
            <h3>Trends Overview</h3>
            <MemoizedTrendsChart data={trendsData} />
          </div>
        )}

        {comparisonData && <MemoizedComparisonCharts data={comparisonData} />}
      </>
    );
  }
);

function Dashboard() {
  const [searchParams] = useSearchParams();
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [trendsData, setTrendsData] = useState<TrendsData | null>(null);
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use ref to track current filters and prevent unnecessary re-renders
  const currentFiltersRef = useRef<Filters>({
    timeRange: searchParams.get("timeRange") || "30d",
    studyType: searchParams.get("studyType") || "all",
    ageGroup: searchParams.get("ageGroup") || "all",
    region: searchParams.get("region") || "all",
  });

  // Track if initial load has been completed
  const hasInitializedRef = useRef(false);

  // Memoized fetch function to prevent unnecessary re-renders
  const fetchData = useCallback(async (filters: Filters) => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const queryParams = new URLSearchParams();
      if (filters.timeRange !== "30d")
        queryParams.set("timeRange", filters.timeRange);
      if (filters.studyType !== "all")
        queryParams.set("studyType", filters.studyType);
      if (filters.ageGroup !== "all")
        queryParams.set("ageGroup", filters.ageGroup);
      if (filters.region !== "all") queryParams.set("region", filters.region);

      const queryString = queryParams.toString();
      const apiSuffix = queryString ? `?${queryString}` : "";

      const [summaryRes, trendsRes, comparisonRes] = await Promise.all([
        authenticatedFetch(`/api/summary${apiSuffix}`),
        authenticatedFetch(`/api/trends${apiSuffix}`),
        authenticatedFetch(`/api/comparisons${apiSuffix}`),
      ]);

      if (!summaryRes.ok || !trendsRes.ok || !comparisonRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const [summary, trends, comparisons] = await Promise.all([
        summaryRes.json(),
        trendsRes.json(),
        comparisonRes.json(),
      ]);

      setSummaryData(summary);
      setTrendsData(trends);
      setComparisonData(comparisons);
    } catch (err) {
      console.error("❌ Error fetching data:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data fetch only - run once on mount
  useEffect(() => {
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      fetchData(currentFiltersRef.current);
    }
  }, []); // Remove fetchData dependency to prevent re-runs

  // Handle filter changes without triggering full re-renders
  const handleFiltersChange = useCallback(
    (newFilters: Filters) => {
      // Only fetch data if filters actually changed
      if (
        JSON.stringify(newFilters) !== JSON.stringify(currentFiltersRef.current)
      ) {
        currentFiltersRef.current = newFilters;
        fetchData(newFilters);
      }
    },
    [fetchData]
  );

  return (
    <main className="dashboard">
      <div className="container">
        <DataFilters onFiltersChange={handleFiltersChange} />

        <DataDisplay
          summaryData={summaryData}
          trendsData={trendsData}
          comparisonData={comparisonData}
          loading={loading}
          error={error}
        />
      </div>
    </main>
  );
}

// Memoize the entire Dashboard component
const MemoizedDashboard = React.memo(Dashboard);

function App() {
  return (
    <div className="App">
      <header className="header" style={{ marginBottom: 0 }}>
        <div className="container">
          <h1>Research Analytics Dashboard</h1>
        </div>
      </header>

      <MemoizedDashboard />
    </div>
  );
}

export default App;
