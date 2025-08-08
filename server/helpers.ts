import {
  DailyMetric,
  FilterCriteria,
  SummaryMetrics,
  AggregatedMetricData,
  MetricDimension,
  TrendsData,
  ComparisonsData,
} from "./index.types";

// Helper function to filter daily metrics based on criteria
export const filterDailyMetrics = (
  data: DailyMetric[],
  filters: FilterCriteria
): DailyMetric[] => {
  // Handle null/undefined filters
  if (!filters) {
    return data;
  }

  // Pre-calculate date cutoff if timeRange filter is present
  let cutoffDate: Date | null = null;
  if (filters.timeRange) {
    const days = parseInt(filters.timeRange.replace("d", ""));
    cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
  }

  return data.filter((item) => {
    // Time range filter
    if (cutoffDate) {
      const itemDate = new Date(item.date);
      if (itemDate < cutoffDate) return false;
    }

    // Study type filter
    if (filters.studyType && filters.studyType !== "all") {
      if (item.studyType !== filters.studyType) return false;
    }

    // Age group filter
    if (filters.ageGroup && filters.ageGroup !== "all") {
      if (item.ageGroup !== filters.ageGroup) return false;
    }

    // Region filter
    if (filters.region && filters.region !== "all") {
      if (item.region !== filters.region) return false;
    }

    return true;
  });
};

// Helper function to aggregate filtered data (updated for daily metrics)
export const aggregateData = (filteredData: DailyMetric[]): SummaryMetrics => {
  const summary = {
    totalParticipants: 0,
    activeParticipants: 0,
    totalStudies: 0,
    activeStudies: 0,
    averageEligibilityRate: 0,
    completionRate: 0,
  };

  if (!filteredData || filteredData.length === 0) {
    return summary;
  }

  // Use a single pass to calculate all metrics
  let applications = 0;
  let completions = 0;
  let newParticipants = 0;
  const studyIds = new Set<string>();

  for (const item of filteredData) {
    applications += item.applicationsCount || 0;
    completions += item.completionsCount || 0;
    newParticipants += item.newParticipantsCount || 0;
    if (item.studyId) {
      studyIds.add(item.studyId);
    }
  }

  summary.totalParticipants = newParticipants;
  summary.activeParticipants = Math.floor(newParticipants * 0.7);
  summary.totalStudies = studyIds.size;
  summary.activeStudies = Math.floor(studyIds.size * 0.6);

  // Handle division by zero cases
  if (applications + completions > 0) {
    summary.averageEligibilityRate =
      Math.round((applications / (applications + completions)) * 100 * 10) / 10;
  } else {
    summary.averageEligibilityRate = 0;
  }

  if (applications > 0) {
    summary.completionRate =
      Math.round((completions / applications) * 100 * 10) / 10;
  } else {
    summary.completionRate = 0;
  }

  return summary;
};

import { QueryParams } from "./index.types";

// Validation function for query parameters
export const validateQueryParams = (query: QueryParams): string[] => {
  const errors: string[] = [];

  // Validate timeRange
  if (
    query.timeRange !== undefined &&
    query.timeRange !== null &&
    query.timeRange !== "" &&
    !["7d", "14d", "30d"].includes(query.timeRange)
  ) {
    errors.push(
      `Invalid timeRange: ${query.timeRange}. Must be one of: 7d, 14d, 30d`
    );
  }

  // Validate studyType
  if (
    query.studyType !== undefined &&
    query.studyType !== null &&
    query.studyType !== "" &&
    query.studyType !== "all" &&
    ![
      "Clinical Trials",
      "Surveys",
      "Focus Groups",
      "Longitudinal Studies",
      "Interviews",
      "Observational Studies",
    ].includes(query.studyType)
  ) {
    errors.push(
      `Invalid studyType: ${query.studyType}. Must be one of the valid study types or "all"`
    );
  }

  // Validate ageGroup
  if (
    query.ageGroup !== undefined &&
    query.ageGroup !== null &&
    query.ageGroup !== "" &&
    query.ageGroup !== "all" &&
    !["18-24", "25-34", "35-44", "45-54", "55-64", "65+"].includes(
      query.ageGroup
    )
  ) {
    errors.push(
      `Invalid ageGroup: ${query.ageGroup}. Must be one of the valid age groups or "all"`
    );
  }

  // Validate region
  if (
    query.region !== undefined &&
    query.region !== null &&
    query.region !== "" &&
    query.region !== "all" &&
    ![
      "North America",
      "Europe",
      "Asia",
      "South America",
      "Africa",
      "Australia",
    ].includes(query.region)
  ) {
    errors.push(
      `Invalid region: ${query.region}. Must be one of the valid regions or "all"`
    );
  }

  return errors;
};

export function addMetricToMap(
  metric: DailyMetric,
  metricMap: Map<string, AggregatedMetricData>,
  metricToCheck: MetricDimension
): void {
  const metricKey = metric[metricToCheck];
  if (metricKey) {
    const existing = metricMap.get(metricKey) || {
      applications: 0,
      completions: 0,
    };
    existing.applications += metric.applicationsCount || 0;
    existing.completions += metric.completionsCount || 0;
    metricMap.set(metricKey, existing);
  }
}

// Helper function to generate trends from filtered metrics
export const generateTrendsFromMetrics = (
  filteredMetrics: DailyMetric[]
): TrendsData => {
  // Create a map for efficient date-based lookups
  const dateMap = new Map<
    string,
    { applications: number; completions: number; newParticipants: number }
  >();

  // Single pass to aggregate data by date
  for (const metric of filteredMetrics) {
    const date = metric.date;
    const existing = dateMap.get(date) || {
      applications: 0,
      completions: 0,
      newParticipants: 0,
    };

    existing.applications += metric.applicationsCount || 0;
    existing.completions += metric.completionsCount || 0;
    existing.newParticipants += metric.newParticipantsCount || 0;

    dateMap.set(date, existing);
  }

  const dates = Array.from(dateMap.keys()).sort();

  const metrics = [
    {
      name: "Study Applications",
      data: dates.map((date) => ({
        date,
        value: dateMap.get(date)!.applications,
      })),
    },
    {
      name: "Study Completions",
      data: dates.map((date) => ({
        date,
        value: dateMap.get(date)!.completions,
      })),
    },
    {
      name: "New Participants",
      data: dates.map((date) => ({
        date,
        value: dateMap.get(date)!.newParticipants,
      })),
    },
  ];

  const timeRanges: TrendsData["timeRanges"] = {
    "7d": {
      interval: "day",
      metrics: metrics.map((metric) => ({
        name: metric.name,
        data: metric.data.slice(-7),
      })),
    },
    "14d": {
      interval: "day",
      metrics: metrics.map((metric) => ({
        name: metric.name,
        data: metric.data.slice(-14),
      })),
    },
    "30d": {
      interval: "day",
      metrics,
    },
  };

  return {
    timeRanges,
  };
};

// Helper function to generate comparisons from filtered metrics
export const generateComparisonsFromMetrics = (
  filteredMetrics: DailyMetric[],
  filters: FilterCriteria
): ComparisonsData => {
  const STUDY_TYPES = [
    "Clinical Trials",
    "Surveys",
    "Focus Groups",
    "Longitudinal Studies",
    "Interviews",
    "Observational Studies",
  ];
  const AGE_GROUPS = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"];
  const REGIONS = [
    "North America",
    "Europe",
    "Asia",
    "South America",
    "Africa",
    "Australia",
  ];

  // Create maps for efficient aggregation
  const studyTypeMap = new Map<
    string,
    { applications: number; completions: number }
  >();
  const ageGroupMap = new Map<
    string,
    { applications: number; completions: number }
  >();
  const regionMap = new Map<
    string,
    { applications: number; completions: number }
  >();

  // Single pass to aggregate data by dimensions
  for (const metric of filteredMetrics) {
    // Study type aggregation
    addMetricToMap(metric, studyTypeMap, "studyType");

    // Age group aggregation
    addMetricToMap(metric, ageGroupMap, "ageGroup");

    // Region aggregation
    addMetricToMap(metric, regionMap, "region");
  }

  // Study type comparison
  const studyTypeComparison = {
    dimension: "studyType",
    metrics: STUDY_TYPES.map((type) => {
      const data = studyTypeMap.get(type) || {
        applications: 0,
        completions: 0,
      };
      return {
        name: type,
        applications: data.applications,
        completions: data.completions,
      };
    }),
  };

  // Filter by studyType if a specific study type is selected (not "all")
  if (filters.studyType && filters.studyType !== "all") {
    studyTypeComparison.metrics = studyTypeComparison.metrics.filter(
      (item: any) => item.name === filters.studyType
    );
  }

  // Age group comparison
  const ageGroupComparison = {
    dimension: "ageGroup",
    metrics: AGE_GROUPS.map((group) => {
      const data = ageGroupMap.get(group) || {
        applications: 0,
        completions: 0,
      };
      return {
        name: group,
        applications: data.applications,
        completions: data.completions,
      };
    }),
  };

  // Region comparison
  const regionComparison = {
    dimension: "region",
    metrics: REGIONS.map((region) => {
      const data = regionMap.get(region) || { applications: 0, completions: 0 };
      return {
        name: region,
        applications: data.applications,
        completions: data.completions,
      };
    }),
  };

  return {
    studyType: studyTypeComparison,
    ageGroup: ageGroupComparison,
    region: regionComparison,
  };
};
