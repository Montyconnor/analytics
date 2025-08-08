// ============================================================================
// API Request & Response Types
// ============================================================================

/**
 * Query parameters for API endpoints
 */
export interface QueryParams {
  timeRange?: string | null;
  studyType?: string | null;
  ageGroup?: string | null;
  region?: string | null;
}

/**
 * Filter criteria for data processing
 */
export interface FilterCriteria {
  timeRange?: string;
  studyType?: string;
  ageGroup?: string;
  region?: string;
}

/**
 * Standard API error response
 */
export interface ApiErrorResponse {
  error: string;
  message?: string;
  details?: string[];
}

/**
 * Standard API success response wrapper
 */
export interface ApiSuccessResponse<T> {
  data?: T;
  error?: never;
}

/**
 * Generic API response type
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// ============================================================================
// Data Model Types
// ============================================================================

/**
 * Daily metrics data point
 */
export interface DailyMetric {
  id?: string;
  date: string;
  studyType: string;
  ageGroup: string;
  region: string;
  applicationsCount: number;
  completionsCount: number;
  newParticipantsCount: number;
  studyId?: string;
}

/**
 * Summary metrics for dashboard
 */
export interface SummaryMetrics {
  totalParticipants: number;
  activeParticipants: number;
  totalStudies: number;
  activeStudies: number;
  averageEligibilityRate: number;
  completionRate: number;
}

/**
 * Time series data point
 */
export interface TimeSeriesDataPoint {
  date: string;
  value: number;
}

/**
 * Metric with time series data
 */
export interface TimeSeriesMetric {
  name: string;
  data: TimeSeriesDataPoint[];
}

/**
 * Time range configuration
 */
export interface TimeRangeConfig {
  interval: string;
  metrics: TimeSeriesMetric[];
}

/**
 * Trends data structure
 */
export interface TrendsData {
  timeRanges: {
    "7d": TimeRangeConfig;
    "14d": TimeRangeConfig;
    "30d": TimeRangeConfig;
  };
}

/**
 * Comparison metric data
 */
export interface ComparisonMetric {
  name: string;
  applications: number;
  completions: number;
}

/**
 * Comparison dimension data
 */
export interface ComparisonDimension {
  dimension: string;
  metrics: ComparisonMetric[];
}

/**
 * Comparisons data structure
 */
export interface ComparisonsData {
  studyType: ComparisonDimension;
  ageGroup: ComparisonDimension;
  region: ComparisonDimension;
}

/**
 * Filter options data
 */
export interface FilterOptions {
  studyTypes: string[];
  ageGroups: string[];
  regions: string[];
  timeRanges: string[];
}

// ============================================================================
// Function Parameter Types
// ============================================================================

/**
 * Parameters for filterDailyMetrics function
 */
export interface FilterDailyMetricsParams {
  data: DailyMetric[];
  filters: FilterCriteria;
}

/**
 * Parameters for aggregateData function
 */
export interface AggregateDataParams {
  filteredData: DailyMetric[];
}

/**
 * Parameters for validateQueryParams function
 */
export interface ValidateQueryParamsParams {
  query: QueryParams;
}

/**
 * Parameters for addMetricToMap function
 */
export interface AddMetricToMapParams {
  metric: DailyMetric;
  metricMap: Map<string, AggregatedMetricData>;
  metricToCheck: "studyType" | "ageGroup" | "region";
}

/**
 * Aggregated metric data for Map storage
 */
export interface AggregatedMetricData {
  applications: number;
  completions: number;
}

/**
 * Parameters for generateTrendsFromMetrics function
 */
export interface GenerateTrendsFromMetricsParams {
  filteredMetrics: DailyMetric[];
}

/**
 * Parameters for generateComparisonsFromMetrics function
 */
export interface GenerateComparisonsFromMetricsParams {
  filteredMetrics: DailyMetric[];
  filters: FilterCriteria;
}

// ============================================================================
// Express.js Types
// ============================================================================

import { Request, Response, NextFunction } from "express";

/**
 * Authentication middleware function type
 */
export type AuthenticationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

// ============================================================================
// Environment & Configuration Types
// ============================================================================

/**
 * Server configuration
 */
export interface ServerConfig {
  port: number;
  apiKey: string;
  corsOrigin?: string;
  cacheControl: string;
}

/**
 * Environment variables interface
 */
export interface EnvironmentVariables {
  PORT?: string;
  API_KEY?: string;
  VITE_API_KEY?: string;
  NODE_ENV?: string;
}

// ============================================================================
// API Endpoint Response Types
// ============================================================================

/**
 * Summary endpoint response
 */
export type SummaryResponse = SummaryMetrics;

/**
 * Trends endpoint response
 */
export type TrendsResponse = {
  timeRanges: {
    [key: string]: TimeRangeConfig;
  };
};

/**
 * Comparisons endpoint response
 */
export type ComparisonsResponse = ComparisonsData;

/**
 * Filter options endpoint response
 */
export type FilterOptionsResponse = FilterOptions;

// ============================================================================
// Validation & Error Types
// ============================================================================

/**
 * Validation error
 */
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

/**
 * Validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * HTTP status codes
 */
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

// ============================================================================
// Constants & Enums
// ============================================================================

/**
 * Valid time range values
 */
export type ValidTimeRange = "7d" | "14d" | "30d";

/**
 * Valid study types
 */
export type ValidStudyType =
  | "Clinical Trials"
  | "Surveys"
  | "Focus Groups"
  | "Longitudinal Studies"
  | "Interviews"
  | "Observational Studies";

/**
 * Valid age groups
 */
export type ValidAgeGroup =
  | "18-24"
  | "25-34"
  | "35-44"
  | "45-54"
  | "55-64"
  | "65+";

/**
 * Valid regions
 */
export type ValidRegion =
  | "North America"
  | "Europe"
  | "Asia"
  | "South America"
  | "Africa"
  | "Australia";

/**
 * Metric dimension types
 */
export type MetricDimension = "studyType" | "ageGroup" | "region";

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Make all properties optional
 */
export type Partial<T> = {
  [P in keyof T]?: T[P];
};

/**
 * Make all properties required
 */
export type Required<T> = {
  [P in keyof T]-?: T[P];
};

/**
 * Pick specific properties from a type
 */
export type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

/**
 * Omit specific properties from a type
 */
export type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

/**
 * Record type for key-value pairs
 */
export type Record<K extends keyof any, T> = {
  [P in K]: T;
};

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard to check if value is a valid time range
 */
export function isValidTimeRange(value: string): value is ValidTimeRange {
  return ["7d", "14d", "30d"].includes(value);
}

/**
 * Type guard to check if value is a valid study type
 */
export function isValidStudyType(value: string): value is ValidStudyType {
  const validTypes: ValidStudyType[] = [
    "Clinical Trials",
    "Surveys",
    "Focus Groups",
    "Longitudinal Studies",
    "Interviews",
    "Observational Studies",
  ];
  return validTypes.includes(value as ValidStudyType);
}

/**
 * Type guard to check if value is a valid age group
 */
export function isValidAgeGroup(value: string): value is ValidAgeGroup {
  const validGroups: ValidAgeGroup[] = [
    "18-24",
    "25-34",
    "35-44",
    "45-54",
    "55-64",
    "65+",
  ];
  return validGroups.includes(value as ValidAgeGroup);
}

/**
 * Type guard to check if value is a valid region
 */
export function isValidRegion(value: string): value is ValidRegion {
  const validRegions: ValidRegion[] = [
    "North America",
    "Europe",
    "Asia",
    "South America",
    "Africa",
    "Australia",
  ];
  return validRegions.includes(value as ValidRegion);
}

/**
 * Type guard to check if object is a DailyMetric
 */
export function isDailyMetric(obj: any): obj is DailyMetric {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.date === "string" &&
    typeof obj.studyType === "string" &&
    typeof obj.ageGroup === "string" &&
    typeof obj.region === "string" &&
    typeof obj.applicationsCount === "number" &&
    typeof obj.completionsCount === "number" &&
    typeof obj.newParticipantsCount === "number"
  );
}

/**
 * Type guard to check if object is a SummaryMetrics
 */
export function isSummaryMetrics(obj: any): obj is SummaryMetrics {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.totalParticipants === "number" &&
    typeof obj.activeParticipants === "number" &&
    typeof obj.totalStudies === "number" &&
    typeof obj.activeStudies === "number" &&
    typeof obj.averageEligibilityRate === "number" &&
    typeof obj.completionRate === "number"
  );
}
