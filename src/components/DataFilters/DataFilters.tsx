import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useSearchParams } from "react-router-dom";
import { X, Filter } from "lucide-react";
import { authenticatedFetch } from "../../config";

interface FilterOptions {
  studyTypes: string[];
  ageGroups: string[];
  regions: string[];
  timeRanges: string[];
}

interface DataFiltersProps {
  onFiltersChange: (filters: any) => void;
}

const DataFilters: React.FC<DataFiltersProps> = ({ onFiltersChange }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(
    null
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);

  // Track if filter options have been fetched
  const hasFetchedOptionsRef = useRef(false);

  // Get current filters from URL
  const currentFilters = useMemo(
    () => ({
      timeRange: searchParams.get("timeRange") || "30d",
      studyType: searchParams.get("studyType") || "all",
      ageGroup: searchParams.get("ageGroup") || "all",
      region: searchParams.get("region") || "all",
    }),
    [searchParams]
  );

  // Fetch filter options only once
  useEffect(() => {
    if (!hasFetchedOptionsRef.current && !isLoadingOptions) {
      hasFetchedOptionsRef.current = true;
      setIsLoadingOptions(true);

      const fetchFilterOptions = async () => {
        try {
          const response = await authenticatedFetch("/api/filter-options");
          if (response.ok) {
            const options = await response.json();
            setFilterOptions(options);
          }
        } catch (error) {
          console.error("❌ Failed to fetch filter options:", error);
        } finally {
          setIsLoadingOptions(false);
        }
      };

      fetchFilterOptions();
    }
  }, [isLoadingOptions]);

  // Update URL and notify parent when filters change
  const updateFilters = useCallback(
    (newFilters: any) => {
      const updatedParams = new URLSearchParams(searchParams);

      // Update URL parameters
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value && value !== "all" && value !== "30d") {
          updatedParams.set(key, value as string);
        } else {
          updatedParams.delete(key);
        }
      });

      setSearchParams(updatedParams);
      onFiltersChange(newFilters);
    },
    [searchParams, onFiltersChange]
  );

  // Handle individual filter changes
  const handleFilterChange = useCallback(
    (filterType: string, value: string) => {
      const newFilters = { ...currentFilters, [filterType]: value };
      updateFilters(newFilters);

      // Keep filters expanded when a filter is selected
      if (!isExpanded) {
        setIsExpanded(true);
      }
    },
    [currentFilters, updateFilters, isExpanded]
  );

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    const newFilters = {
      timeRange: "30d",
      studyType: "all",
      ageGroup: "all",
      region: "all",
    };
    updateFilters(newFilters);
  }, [updateFilters]);

  // Clear specific filter
  const clearFilter = useCallback(
    (filterType: string) => {
      const newFilters = {
        ...currentFilters,
        [filterType]: filterType === "timeRange" ? "30d" : "all",
      };
      updateFilters(newFilters);
    },
    [currentFilters, updateFilters]
  );

  // Check if any filters are active
  const hasActiveFilters = Object.values(currentFilters).some(
    (value) => value !== "all" && value !== "30d"
  );

  if (isLoadingOptions || !filterOptions) {
    return (
      <div className="filters-container">
        <div className="filter-header">
          <button className="filter-toggle" disabled>
            <Filter size={16} />
            <span>Filters</span>
          </button>
        </div>
        <div
          className="loading"
          style={{ padding: "1rem", textAlign: "center" }}
        >
          Loading filter options...
        </div>
      </div>
    );
  }

  return (
    <div className="filters-container">
      {/* Filter Header */}
      <div className="filter-header">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="filter-toggle"
        >
          <Filter size={16} />
          <span>Filters</span>
          {hasActiveFilters && <div className="active-indicator" />}
        </button>

        {hasActiveFilters && (
          <button onClick={clearAllFilters} className="clear-all">
            Clear All
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="active-filters">
          {currentFilters.timeRange !== "30d" && (
            <span className="filter-tag">
              Time: {currentFilters.timeRange}
              <button onClick={() => clearFilter("timeRange")}>
                <X size={12} />
              </button>
            </span>
          )}
          {currentFilters.studyType !== "all" && (
            <span className="filter-tag">
              Study: {currentFilters.studyType}
              <button onClick={() => clearFilter("studyType")}>
                <X size={12} />
              </button>
            </span>
          )}
          {currentFilters.ageGroup !== "all" && (
            <span className="filter-tag">
              Age: {currentFilters.ageGroup}
              <button onClick={() => clearFilter("ageGroup")}>
                <X size={12} />
              </button>
            </span>
          )}
          {currentFilters.region !== "all" && (
            <span className="filter-tag">
              Region: {currentFilters.region}
              <button onClick={() => clearFilter("region")}>
                <X size={12} />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Filter Controls */}
      {isExpanded && (
        <div className="filter-controls">
          <div className="filter-group">
            <label>Time Range</label>
            <select
              value={currentFilters.timeRange}
              onChange={(e) => handleFilterChange("timeRange", e.target.value)}
            >
              <option value="7d">Last 7 days</option>
              <option value="14d">Last 14 days</option>
              <option value="30d">Last 30 days</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Study Type</label>
            <select
              value={currentFilters.studyType}
              onChange={(e) => handleFilterChange("studyType", e.target.value)}
            >
              <option value="all">All Study Types</option>
              {filterOptions.studyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Age Group</label>
            <select
              value={currentFilters.ageGroup}
              onChange={(e) => handleFilterChange("ageGroup", e.target.value)}
            >
              <option value="all">All Age Groups</option>
              {filterOptions.ageGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Region</label>
            <select
              value={currentFilters.region}
              onChange={(e) => handleFilterChange("region", e.target.value)}
            >
              <option value="all">All Regions</option>
              {filterOptions.regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataFilters;
