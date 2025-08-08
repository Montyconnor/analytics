import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs/promises";
import dotenv from "dotenv";
import {
  aggregateData,
  validateQueryParams,
  filterDailyMetrics,
  generateTrendsFromMetrics,
  generateComparisonsFromMetrics,
} from "./helpers";
import {
  QueryParams,
  FilterCriteria,
  DailyMetric,
  SummaryMetrics,
  TrendsData,
  ComparisonsData,
  FilterOptions,
  ApiErrorResponse,
  AuthenticationMiddleware,
  HttpStatus,
} from "./index.types";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// API Key for authentication - in production, this should be an environment variable
const API_KEY = process.env.API_KEY || "your-secure-api-key-here";

// Authentication middleware
const authenticateRequest: AuthenticationMiddleware = (req, res, next) => {
  // Check for API key in headers
  const apiKey = req.headers["x-api-key"] || req.headers["authorization"];

  if (!apiKey) {
    const errorResponse: ApiErrorResponse = {
      error: "Authentication required",
      message: "API key is missing",
    };
    return res.status(HttpStatus.UNAUTHORIZED).json(errorResponse);
  }

  // Remove 'Bearer ' prefix if present
  const cleanApiKey =
    typeof apiKey === "string" && apiKey.startsWith("Bearer ")
      ? apiKey.substring(7)
      : apiKey;

  if (cleanApiKey !== API_KEY) {
    const errorResponse: ApiErrorResponse = {
      error: "Authentication failed",
      message: "Invalid API key",
    };
    return res.status(HttpStatus.FORBIDDEN).json(errorResponse);
  }

  next();
};

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React build
app.use(express.static(path.join(__dirname, "../dist")));

// Apply authentication middleware only to API routes
app.use("/api", authenticateRequest);

// API Routes
app.get("/api/summary", async (req, res) => {
  try {
    // Validate query parameters
    const validationErrors = validateQueryParams(req.query as QueryParams);
    if (validationErrors.length > 0) {
      const errorResponse: ApiErrorResponse = {
        error: "Invalid query parameters",
        details: validationErrors,
      };
      return res.status(HttpStatus.BAD_REQUEST).json(errorResponse);
    }

    const filters: FilterCriteria = {
      timeRange: req.query.timeRange as string,
      studyType: req.query.studyType as string,
      ageGroup: req.query.ageGroup as string,
      region: req.query.region as string,
    };

    const dailyMetrics: DailyMetric[] = JSON.parse(
      await fs.readFile(
        path.join(__dirname, "../data/dailyMetrics.json"),
        "utf8"
      )
    );

    const filteredMetrics = filterDailyMetrics(dailyMetrics, filters);
    const summaryData: SummaryMetrics = aggregateData(filteredMetrics);

    res.json(summaryData);
  } catch (error) {
    const errorResponse: ApiErrorResponse = {
      error: "Failed to load summary data",
    };
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse);
  }
});

app.get("/api/trends", async (req, res) => {
  try {
    // Validate query parameters
    const validationErrors = validateQueryParams(req.query as QueryParams);
    if (validationErrors.length > 0) {
      const errorResponse: ApiErrorResponse = {
        error: "Invalid query parameters",
        details: validationErrors,
      };
      return res.status(HttpStatus.BAD_REQUEST).json(errorResponse);
    }

    const filters: FilterCriteria = {
      timeRange: req.query.timeRange as string,
      studyType: req.query.studyType as string,
      ageGroup: req.query.ageGroup as string,
      region: req.query.region as string,
    };

    const dailyMetrics: DailyMetric[] = JSON.parse(
      await fs.readFile(
        path.join(__dirname, "../data/dailyMetrics.json"),
        "utf8"
      )
    );

    const filteredMetrics = filterDailyMetrics(dailyMetrics, filters);
    const trendsData: TrendsData = generateTrendsFromMetrics(filteredMetrics);

    // Use the timeRange filter to determine which range to return
    const requestedRange = filters.timeRange || "30d";

    // Return only the requested range
    if (
      trendsData.timeRanges[
        requestedRange as keyof typeof trendsData.timeRanges
      ]
    ) {
      res.json({
        timeRanges: {
          [requestedRange]:
            trendsData.timeRanges[
              requestedRange as keyof typeof trendsData.timeRanges
            ],
        },
      } as any);
    } else {
      const errorResponse: ApiErrorResponse = {
        error: "Range not found",
      };
      res.status(HttpStatus.NOT_FOUND).json(errorResponse);
    }
  } catch (error) {
    const errorResponse: ApiErrorResponse = {
      error: "Failed to load trends data",
    };
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse);
  }
});

app.get("/api/comparisons", async (req, res) => {
  try {
    // Validate query parameters
    const validationErrors = validateQueryParams(req.query as QueryParams);
    if (validationErrors.length > 0) {
      const errorResponse: ApiErrorResponse = {
        error: "Invalid query parameters",
        details: validationErrors,
      };
      return res.status(HttpStatus.BAD_REQUEST).json(errorResponse);
    }

    const filters: FilterCriteria = {
      timeRange: req.query.timeRange as string,
      studyType: req.query.studyType as string,
      ageGroup: req.query.ageGroup as string,
      region: req.query.region as string,
    };

    const dailyMetrics: DailyMetric[] = JSON.parse(
      await fs.readFile(
        path.join(__dirname, "../data/dailyMetrics.json"),
        "utf8"
      )
    );

    const filteredMetrics = filterDailyMetrics(dailyMetrics, filters);
    const comparisonsData: ComparisonsData = generateComparisonsFromMetrics(
      filteredMetrics,
      filters
    );

    res.json(comparisonsData);
  } catch (error) {
    const errorResponse: ApiErrorResponse = {
      error: "Failed to load comparisons data",
    };
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse);
  }
});

app.get("/api/filter-options", async (_req, res) => {
  try {
    const filterOptions: FilterOptions = JSON.parse(
      await fs.readFile(
        path.join(__dirname, "../data/filterOptions.json"),
        "utf8"
      )
    );
    res.json(filterOptions);
  } catch (error) {
    const errorResponse: ApiErrorResponse = {
      error: "Failed to load filter options",
    };
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse);
  }
});

// Serve React app for all other routes
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
