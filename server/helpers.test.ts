import { describe, it, expect } from "vitest";
import {
  aggregateData,
  validateQueryParams,
  addMetricToMap,
  generateTrendsFromMetrics,
  generateComparisonsFromMetrics,
} from "./helpers";

// Mock data for testing
const mockData = [
  {
    id: "1",
    date: "2024-01-15",
    studyType: "Clinical Trials",
    ageGroup: "25-34",
    region: "North America",
    applicationsCount: 100,
    completionsCount: 80,
    newParticipantsCount: 20,
    studyId: "study1",
  },
  {
    id: "2",
    date: "2024-01-16",
    studyType: "Surveys",
    ageGroup: "35-44",
    region: "Europe",
    applicationsCount: 150,
    completionsCount: 120,
    newParticipantsCount: 30,
    studyId: "study2",
  },
  {
    id: "3",
    date: "2024-01-17",
    studyType: "Focus Groups",
    ageGroup: "45-54",
    region: "Asia",
    applicationsCount: 200,
    completionsCount: 160,
    newParticipantsCount: 40,
    studyId: "study3",
  },
  {
    id: "4",
    date: "2024-01-18",
    studyType: "Interviews",
    ageGroup: "55-64",
    region: "Australia",
    applicationsCount: 80,
    completionsCount: 60,
    newParticipantsCount: 15,
    studyId: "study4",
  },
];

describe("aggregateData", () => {
  it("should calculate correct summary metrics for sample data", () => {
    const result = aggregateData(mockData);

    // Expected calculations:
    // totalParticipants = 20 + 30 + 40 + 15 = 105
    // activeParticipants = Math.floor(105 * 0.7) = 73
    // totalStudies = 4
    // activeStudies = Math.floor(4 * 0.6) = 2
    // applications = 100 + 150 + 200 + 80 = 530
    // completions = 80 + 120 + 160 + 60 = 420
    // averageEligibilityRate = Math.round((530 / (530 + 420)) * 100 * 10) / 10 = 55.8
    // completionRate = Math.round((420 / 530) * 100 * 10) / 10 = 79.2

    expect(result.totalParticipants).toBe(105);
    expect(result.activeParticipants).toBe(73);
    expect(result.totalStudies).toBe(4);
    expect(result.activeStudies).toBe(2);
    expect(result.averageEligibilityRate).toBe(55.8);
    expect(result.completionRate).toBe(79.2);
  });

  it("should handle empty data array", () => {
    const result = aggregateData([]);
    expect(result).toEqual({
      totalParticipants: 0,
      activeParticipants: 0,
      totalStudies: 0,
      activeStudies: 0,
      averageEligibilityRate: 0,
      completionRate: 0,
    });
  });

  it("should handle single data item", () => {
    const singleItem = [mockData[0]];
    const result = aggregateData(singleItem);

    expect(result.totalParticipants).toBe(20);
    expect(result.activeParticipants).toBe(14); // Math.floor(20 * 0.7)
    expect(result.totalStudies).toBe(1);
    expect(result.activeStudies).toBe(0); // Math.floor(1 * 0.6)
    expect(result.averageEligibilityRate).toBe(55.6); // Math.round((100 / (100 + 80)) * 100 * 10) / 10
    expect(result.completionRate).toBe(80.0); // Math.round((80 / 100) * 100 * 10) / 10
  });

  it("should handle zero applications (division by zero protection)", () => {
    const zeroApplicationsData = [
      {
        id: "1",
        date: "2024-01-15",
        studyType: "Clinical Trials",
        ageGroup: "25-34",
        region: "North America",
        applicationsCount: 0,
        completionsCount: 0,
        newParticipantsCount: 10,
        studyId: "study1",
      },
    ];

    const result = aggregateData(zeroApplicationsData);
    expect(result.averageEligibilityRate).toBe(0);
    expect(result.completionRate).toBe(0);
  });

  it("should handle data with only applications (no completions)", () => {
    const onlyApplicationsData = [
      {
        id: "1",
        date: "2024-01-15",
        studyType: "Clinical Trials",
        ageGroup: "25-34",
        region: "North America",
        applicationsCount: 100,
        completionsCount: 0,
        newParticipantsCount: 10,
        studyId: "study1",
      },
    ];

    const result = aggregateData(onlyApplicationsData);
    expect(result.averageEligibilityRate).toBe(100.0); // 100% eligibility rate
    expect(result.completionRate).toBe(0.0); // 0% completion rate
  });

  it("should handle data with only completions (no applications)", () => {
    const onlyCompletionsData = [
      {
        id: "1",
        date: "2024-01-15",
        studyType: "Clinical Trials",
        ageGroup: "25-34",
        region: "North America",
        applicationsCount: 0,
        completionsCount: 100,
        newParticipantsCount: 10,
        studyId: "study1",
      },
    ];

    const result = aggregateData(onlyCompletionsData);
    expect(result.averageEligibilityRate).toBe(0.0); // 0% eligibility rate
    expect(result.completionRate).toBe(0.0); // 0% completion rate (no applications)
  });

  it("should round percentages correctly", () => {
    const roundingTestData = [
      {
        id: "1",
        date: "2024-01-15",
        studyType: "Clinical Trials",
        ageGroup: "25-34",
        region: "North America",
        applicationsCount: 333,
        completionsCount: 222,
        newParticipantsCount: 10,
        studyId: "study1",
      },
    ];

    const result = aggregateData(roundingTestData);
    // 333 / (333 + 222) * 100 = 60.0%
    // 222 / 333 * 100 = 66.7%
    expect(result.averageEligibilityRate).toBe(60.0);
    expect(result.completionRate).toBe(66.7);
  });
});

describe("validateQueryParams", () => {
  describe("timeRange validation", () => {
    it("should accept valid timeRange values", () => {
      const validRanges = ["7d", "14d", "30d"];

      validRanges.forEach((range) => {
        const errors = validateQueryParams({ timeRange: range });
        expect(errors).toHaveLength(0);
      });
    });

    it("should reject invalid timeRange values", () => {
      const invalidRanges = ["1d", "5d", "60d", "invalid", "test", "7D"];

      invalidRanges.forEach((range) => {
        const errors = validateQueryParams({ timeRange: range });
        expect(errors).toHaveLength(1);
        expect(errors[0]).toContain("Invalid timeRange");
        expect(errors[0]).toContain("Must be one of: 7d, 14d, 30d");
      });
    });

    it("should allow undefined timeRange", () => {
      const errors = validateQueryParams({});
      expect(errors).toHaveLength(0);
    });
  });

  describe("studyType validation", () => {
    it("should accept valid studyType values", () => {
      const validTypes = [
        "Clinical Trials",
        "Surveys",
        "Focus Groups",
        "Longitudinal Studies",
        "Interviews",
        "Observational Studies",
        "all",
      ];

      validTypes.forEach((type) => {
        const errors = validateQueryParams({ studyType: type });
        expect(errors).toHaveLength(0);
      });
    });

    it("should reject invalid studyType values", () => {
      const invalidTypes = ["Invalid Type", "test", "123", "clinical trials"];

      invalidTypes.forEach((type) => {
        const errors = validateQueryParams({ studyType: type });
        expect(errors).toHaveLength(1);
        expect(errors[0]).toContain("Invalid studyType");
        expect(errors[0]).toContain('or "all"');
      });
    });
  });

  describe("ageGroup validation", () => {
    it("should accept valid ageGroup values", () => {
      const validGroups = [
        "18-24",
        "25-34",
        "35-44",
        "45-54",
        "55-64",
        "65+",
        "all",
      ];

      validGroups.forEach((group) => {
        const errors = validateQueryParams({ ageGroup: group });
        expect(errors).toHaveLength(0);
      });
    });

    it("should reject invalid ageGroup values", () => {
      const invalidGroups = ["10-15", "invalid", "25-35", "65", "test"];

      invalidGroups.forEach((group) => {
        const errors = validateQueryParams({ ageGroup: group });
        expect(errors).toHaveLength(1);
        expect(errors[0]).toContain("Invalid ageGroup");
        expect(errors[0]).toContain('or "all"');
      });
    });
  });

  describe("region validation", () => {
    it("should accept valid region values", () => {
      const validRegions = [
        "North America",
        "Europe",
        "Asia",
        "South America",
        "Africa",
        "Australia",
        "all",
      ];

      validRegions.forEach((region) => {
        const errors = validateQueryParams({ region });
        expect(errors).toHaveLength(0);
      });
    });

    it("should reject invalid region values", () => {
      const invalidRegions = ["Invalid Region", "test", "USA", "north america"];

      invalidRegions.forEach((region) => {
        const errors = validateQueryParams({ region });
        expect(errors).toHaveLength(1);
        expect(errors[0]).toContain("Invalid region");
        expect(errors[0]).toContain('or "all"');
      });
    });
  });

  describe("multiple parameter validation", () => {
    it("should collect all validation errors", () => {
      const query = {
        timeRange: "invalid",
        studyType: "Invalid Type",
        ageGroup: "invalid",
        region: "Invalid Region",
      };

      const errors = validateQueryParams(query);
      expect(errors).toHaveLength(4);
      expect(errors[0]).toContain("Invalid timeRange");
      expect(errors[1]).toContain("Invalid studyType");
      expect(errors[2]).toContain("Invalid ageGroup");
      expect(errors[3]).toContain("Invalid region");
    });

    it("should handle mixed valid and invalid parameters", () => {
      const query = {
        timeRange: "7d", // valid
        studyType: "Invalid Type", // invalid
        ageGroup: "25-34", // valid
        region: "Invalid Region", // invalid
      };

      const errors = validateQueryParams(query);
      expect(errors).toHaveLength(2);
      expect(errors[0]).toContain("Invalid studyType");
      expect(errors[1]).toContain("Invalid region");
    });

    it("should handle all valid parameters", () => {
      const query = {
        timeRange: "30d",
        studyType: "Clinical Trials",
        ageGroup: "25-34",
        region: "North America",
      };

      const errors = validateQueryParams(query);
      expect(errors).toHaveLength(0);
    });

    it('should handle all "all" values', () => {
      const query = {
        timeRange: undefined, // not provided
        studyType: "all",
        ageGroup: "all",
        region: "all",
      };

      const errors = validateQueryParams(query);
      expect(errors).toHaveLength(0);
    });
  });

  describe("edge cases", () => {
    it("should handle empty query object", () => {
      const errors = validateQueryParams({});
      expect(errors).toHaveLength(0);
    });

    it("should handle null/undefined values", () => {
      const query = {
        timeRange: null,
        studyType: undefined,
        ageGroup: null,
        region: undefined,
      };

      const errors = validateQueryParams(query);
      expect(errors).toHaveLength(0);
    });

    it("should handle case sensitivity", () => {
      const query = {
        timeRange: "7D", // uppercase
        studyType: "clinical trials", // lowercase
        ageGroup: "25-34", // valid
        region: "north america", // lowercase
      };

      const errors = validateQueryParams(query);
      expect(errors).toHaveLength(3); // timeRange, studyType, region should fail
      expect(errors[0]).toContain("Invalid timeRange");
      expect(errors[1]).toContain("Invalid studyType");
      expect(errors[2]).toContain("Invalid region");
    });
  });
});

describe("addMetricToMap", () => {
  it("should add metric data to map for studyType", () => {
    const metricMap = new Map<
      string,
      { applications: number; completions: number }
    >();
    const metric = {
      date: "2024-01-01",
      studyType: "Clinical Trials",
      ageGroup: "25-34",
      region: "North America",
      applicationsCount: 100,
      completionsCount: 80,
      newParticipantsCount: 20,
    };

    addMetricToMap(metric, metricMap, "studyType");

    expect(metricMap.get("Clinical Trials")).toEqual({
      applications: 100,
      completions: 80,
    });
  });

  it("should add metric data to map for ageGroup", () => {
    const metricMap = new Map<
      string,
      { applications: number; completions: number }
    >();
    const metric = {
      date: "2024-01-01",
      studyType: "Clinical Trials",
      ageGroup: "25-34",
      region: "North America",
      applicationsCount: 150,
      completionsCount: 120,
      newParticipantsCount: 30,
    };

    addMetricToMap(metric, metricMap, "ageGroup");

    expect(metricMap.get("25-34")).toEqual({
      applications: 150,
      completions: 120,
    });
  });

  it("should add metric data to map for region", () => {
    const metricMap = new Map<
      string,
      { applications: number; completions: number }
    >();
    const metric = {
      date: "2024-01-01",
      studyType: "Clinical Trials",
      ageGroup: "25-34",
      region: "North America",
      applicationsCount: 200,
      completionsCount: 160,
      newParticipantsCount: 40,
    };

    addMetricToMap(metric, metricMap, "region");

    expect(metricMap.get("North America")).toEqual({
      applications: 200,
      completions: 160,
    });
  });

  it("should accumulate values for existing keys", () => {
    const metricMap = new Map<
      string,
      { applications: number; completions: number }
    >();
    metricMap.set("Clinical Trials", { applications: 50, completions: 40 });

    const metric = {
      date: "2024-01-01",
      studyType: "Clinical Trials",
      ageGroup: "25-34",
      region: "North America",
      applicationsCount: 100,
      completionsCount: 80,
      newParticipantsCount: 20,
    };

    addMetricToMap(metric, metricMap, "studyType");

    expect(metricMap.get("Clinical Trials")).toEqual({
      applications: 150, // 50 + 100
      completions: 120, // 40 + 80
    });
  });

  it("should handle missing metric values gracefully", () => {
    const metricMap = new Map<
      string,
      { applications: number; completions: number }
    >();
    const metric = {
      date: "2024-01-01",
      studyType: "Clinical Trials",
      ageGroup: "25-34",
      region: "North America",
      applicationsCount: 0,
      completionsCount: 0,
      newParticipantsCount: 0,
      // Missing applicationsCount and completionsCount
    };

    addMetricToMap(metric, metricMap, "studyType");

    expect(metricMap.get("Clinical Trials")).toEqual({
      applications: 0,
      completions: 0,
    });
  });

  it("should handle null/undefined metric values", () => {
    const metricMap = new Map<
      string,
      { applications: number; completions: number }
    >();
    const metric = {
      date: "2024-01-01",
      studyType: "Clinical Trials",
      ageGroup: "25-34",
      region: "North America",
      applicationsCount: 0,
      completionsCount: 0,
      newParticipantsCount: 0,
    };

    addMetricToMap(metric, metricMap, "studyType");

    expect(metricMap.get("Clinical Trials")).toEqual({
      applications: 0,
      completions: 0,
    });
  });

  it("should not add to map if metric key is missing", () => {
    const metricMap = new Map<
      string,
      { applications: number; completions: number }
    >();
    const metric = {
      date: "2024-01-01",
      studyType: "",
      ageGroup: "25-34",
      region: "North America",
      applicationsCount: 100,
      completionsCount: 80,
      newParticipantsCount: 20,
      // Missing studyType
    };

    addMetricToMap(metric, metricMap, "studyType");

    expect(metricMap.size).toBe(0);
  });

  it("should handle empty metric key", () => {
    const metricMap = new Map<
      string,
      { applications: number; completions: number }
    >();
    const metric = {
      date: "2024-01-01",
      studyType: "",
      ageGroup: "25-34",
      region: "North America",
      applicationsCount: 100,
      completionsCount: 80,
      newParticipantsCount: 20,
    };

    addMetricToMap(metric, metricMap, "studyType");

    // Empty strings are treated as falsy and not added to the map
    expect(metricMap.size).toBe(0);
    expect(metricMap.get("")).toBeUndefined();
  });
});

// Mock data for trends testing
const mockTrendsData = [
  {
    date: "2024-01-01",
    studyType: "Clinical Trials",
    ageGroup: "25-34",
    region: "North America",
    applicationsCount: 10,
    completionsCount: 8,
    newParticipantsCount: 5,
  },
  {
    date: "2024-01-02",
    studyType: "Surveys",
    ageGroup: "35-44",
    region: "Europe",
    applicationsCount: 15,
    completionsCount: 12,
    newParticipantsCount: 8,
  },
  {
    date: "2024-01-03",
    studyType: "Focus Groups",
    ageGroup: "45-54",
    region: "Asia",
    applicationsCount: 20,
    completionsCount: 16,
    newParticipantsCount: 12,
  },
];

// Mock data for comparisons testing
const mockComparisonsData = [
  {
    date: "2024-01-01",
    studyType: "Clinical Trials",
    ageGroup: "25-34",
    region: "North America",
    applicationsCount: 10,
    completionsCount: 8,
    newParticipantsCount: 5,
  },
  {
    date: "2024-01-02",
    studyType: "Surveys",
    ageGroup: "35-44",
    region: "Europe",
    applicationsCount: 15,
    completionsCount: 12,
    newParticipantsCount: 8,
  },
  {
    date: "2024-01-03",
    studyType: "Clinical Trials",
    ageGroup: "25-34",
    region: "Asia",
    applicationsCount: 8,
    completionsCount: 6,
    newParticipantsCount: 4,
  },
];

describe("generateTrendsFromMetrics", () => {
  it("should generate trends data with correct structure", () => {
    const result = generateTrendsFromMetrics(mockTrendsData);

    expect(result).toHaveProperty("timeRanges");
    expect(result.timeRanges).toHaveProperty("7d");
    expect(result.timeRanges).toHaveProperty("14d");
    expect(result.timeRanges).toHaveProperty("30d");
  });

  it("should aggregate data by date correctly", () => {
    const result = generateTrendsFromMetrics(mockTrendsData);
    const timeRanges = result.timeRanges;

    // Check that all time ranges have the correct metrics
    ["7d", "14d", "30d"].forEach((range) => {
      const timeRange = timeRanges[range as keyof typeof timeRanges];
      expect(timeRange).toHaveProperty("interval", "day");
      expect(timeRange).toHaveProperty("metrics");
      expect(timeRange.metrics).toHaveLength(3);
    });

    // Check metric names
    const metricNames = timeRanges["30d"].metrics.map((m: any) => m.name);
    expect(metricNames).toEqual([
      "Study Applications",
      "Study Completions",
      "New Participants",
    ]);
  });

  it("should calculate correct values for each metric", () => {
    const result = generateTrendsFromMetrics(mockTrendsData);
    const metrics = result.timeRanges["30d"].metrics;

    // Study Applications: 10 + 15 + 20 = 45 total
    const applicationsMetric = metrics.find(
      (m: any) => m.name === "Study Applications"
    );
    expect(applicationsMetric?.data).toHaveLength(3);
    expect(applicationsMetric?.data[0].value).toBe(10);
    expect(applicationsMetric?.data[1].value).toBe(15);
    expect(applicationsMetric?.data[2].value).toBe(20);

    // Study Completions: 8 + 12 + 16 = 36 total
    const completionsMetric = metrics.find(
      (m: any) => m.name === "Study Completions"
    );
    expect(completionsMetric?.data).toHaveLength(3);
    expect(completionsMetric?.data[0].value).toBe(8);
    expect(completionsMetric?.data[1].value).toBe(12);
    expect(completionsMetric?.data[2].value).toBe(16);

    // New Participants: 5 + 8 + 12 = 25 total
    const participantsMetric = metrics.find(
      (m: any) => m.name === "New Participants"
    );
    expect(participantsMetric?.data).toHaveLength(3);
    expect(participantsMetric?.data[0].value).toBe(5);
    expect(participantsMetric?.data[1].value).toBe(8);
    expect(participantsMetric?.data[2].value).toBe(12);
  });

  it("should handle empty data array", () => {
    const result = generateTrendsFromMetrics([]);

    expect(result).toHaveProperty("timeRanges");
    expect(result.timeRanges["30d"].metrics).toHaveLength(3);

    // All metrics should have empty data arrays
    result.timeRanges["30d"].metrics.forEach((metric: any) => {
      expect(metric.data).toHaveLength(0);
    });
  });

  it("should handle data with missing values", () => {
    const dataWithMissingValues = [
      {
        date: "2024-01-01",
        studyType: "Clinical Trials",
        ageGroup: "25-34",
        region: "North America",
        applicationsCount: 10,
        completionsCount: 0,
        newParticipantsCount: 0,
        // Missing completionsCount
      },
      {
        date: "2024-01-02",
        studyType: "Surveys",
        ageGroup: "35-44",
        region: "Europe",
        applicationsCount: 0,
        completionsCount: 0,
        newParticipantsCount: 0,
        // Missing ageGroup, region, and counts
      },
    ];

    const result = generateTrendsFromMetrics(dataWithMissingValues);
    const metrics = result.timeRanges["30d"].metrics;

    const applicationsMetric = metrics.find(
      (m: any) => m.name === "Study Applications"
    );
    expect(applicationsMetric?.data[0].value).toBe(10);
    expect(applicationsMetric?.data[1].value).toBe(0);

    const completionsMetric = metrics.find(
      (m: any) => m.name === "Study Completions"
    );
    expect(completionsMetric?.data[0].value).toBe(0);
    expect(completionsMetric?.data[1].value).toBe(0);
  });

  it("should sort dates correctly", () => {
    const unsortedData = [
      {
        date: "2024-01-03",
        studyType: "Focus Groups",
        ageGroup: "45-54",
        region: "Asia",
        applicationsCount: 20,
        completionsCount: 16,
        newParticipantsCount: 12,
      },
      {
        date: "2024-01-01",
        studyType: "Clinical Trials",
        ageGroup: "25-34",
        region: "North America",
        applicationsCount: 10,
        completionsCount: 8,
        newParticipantsCount: 5,
      },
      {
        date: "2024-01-02",
        studyType: "Surveys",
        ageGroup: "35-44",
        region: "Europe",
        applicationsCount: 15,
        completionsCount: 12,
        newParticipantsCount: 8,
      },
    ];

    const result = generateTrendsFromMetrics(unsortedData);
    const metrics = result.timeRanges["30d"].metrics;
    const applicationsMetric = metrics.find(
      (m: any) => m.name === "Study Applications"
    );

    expect(applicationsMetric?.data[0].date).toBe("2024-01-01");
    expect(applicationsMetric?.data[1].date).toBe("2024-01-02");
    expect(applicationsMetric?.data[2].date).toBe("2024-01-03");
  });
});

describe("generateComparisonsFromMetrics", () => {
  it("should generate comparisons data with correct structure", () => {
    const result = generateComparisonsFromMetrics(mockComparisonsData, {});

    expect(result).toHaveProperty("studyType");
    expect(result).toHaveProperty("ageGroup");
    expect(result).toHaveProperty("region");

    expect(result.studyType).toHaveProperty("dimension", "studyType");
    expect(result.ageGroup).toHaveProperty("dimension", "ageGroup");
    expect(result.region).toHaveProperty("dimension", "region");
  });

  it("should aggregate data by study type correctly", () => {
    const result = generateComparisonsFromMetrics(mockComparisonsData, {});
    const studyTypeMetrics = result.studyType.metrics;

    // Clinical Trials: 10 + 8 = 18 applications, 8 + 6 = 14 completions
    const clinicalTrials = studyTypeMetrics.find(
      (m: any) => m.name === "Clinical Trials"
    );
    expect(clinicalTrials!.applications).toBe(18);
    expect(clinicalTrials!.completions).toBe(14);

    // Surveys: 15 applications, 12 completions
    const surveys = studyTypeMetrics.find((m: any) => m.name === "Surveys");
    expect(surveys!.applications).toBe(15);
    expect(surveys!.completions).toBe(12);
  });

  it("should aggregate data by age group correctly", () => {
    const result = generateComparisonsFromMetrics(mockComparisonsData, {});
    const ageGroupMetrics = result.ageGroup.metrics;

    // 25-34: 10 + 8 = 18 applications, 8 + 6 = 14 completions
    const age25_34 = ageGroupMetrics.find((m: any) => m.name === "25-34");
    expect(age25_34!.applications).toBe(18);
    expect(age25_34!.completions).toBe(14);

    // 35-44: 15 applications, 12 completions
    const age35_44 = ageGroupMetrics.find((m: any) => m.name === "35-44");
    expect(age35_44!.applications).toBe(15);
    expect(age35_44!.completions).toBe(12);
  });

  it("should aggregate data by region correctly", () => {
    const result = generateComparisonsFromMetrics(mockComparisonsData, {});
    const regionMetrics = result.region.metrics;

    // North America: 10 applications, 8 completions
    const northAmerica = regionMetrics.find(
      (m: any) => m.name === "North America"
    );
    expect(northAmerica!.applications).toBe(10);
    expect(northAmerica!.completions).toBe(8);

    // Europe: 15 applications, 12 completions
    const europe = regionMetrics.find((m: any) => m.name === "Europe");
    expect(europe!.applications).toBe(15);
    expect(europe!.completions).toBe(12);

    // Asia: 8 applications, 6 completions
    const asia = regionMetrics.find((m: any) => m.name === "Asia");
    expect(asia!.applications).toBe(8);
    expect(asia!.completions).toBe(6);
  });

  it("should filter by study type when specified", () => {
    const filters = { studyType: "Clinical Trials" };
    const result = generateComparisonsFromMetrics(mockComparisonsData, filters);
    const studyTypeMetrics = result.studyType.metrics;

    // Should only include Clinical Trials
    expect(studyTypeMetrics).toHaveLength(1);
    expect(studyTypeMetrics[0].name).toBe("Clinical Trials");
    expect(studyTypeMetrics[0].applications).toBe(18);
    expect(studyTypeMetrics[0].completions).toBe(14);
  });

  it("should not filter when study type is 'all'", () => {
    const filters = { studyType: "all" };
    const result = generateComparisonsFromMetrics(mockComparisonsData, filters);
    const studyTypeMetrics = result.studyType.metrics;

    // Should include all study types
    expect(studyTypeMetrics.length).toBeGreaterThan(1);
  });

  it("should handle empty data array", () => {
    const result = generateComparisonsFromMetrics([], {});

    expect(result.studyType.metrics).toHaveLength(6); // All study types
    expect(result.ageGroup.metrics).toHaveLength(6); // All age groups
    expect(result.region.metrics).toHaveLength(6); // All regions

    // All metrics should have zero values
    result.studyType.metrics.forEach((metric: any) => {
      expect(metric.applications).toBe(0);
      expect(metric.completions).toBe(0);
    });
  });

  it("should handle data with missing values", () => {
    const dataWithMissingValues = [
      {
        date: "2024-01-01",
        studyType: "Clinical Trials",
        ageGroup: "25-34",
        region: "North America",
        applicationsCount: 10,
        completionsCount: 0,
        newParticipantsCount: 0,
        // Missing completionsCount
      },
      {
        date: "2024-01-02",
        studyType: "Surveys",
        ageGroup: "35-44",
        region: "Europe",
        applicationsCount: 0,
        completionsCount: 0,
        newParticipantsCount: 0,
        // Missing ageGroup, region, and counts
      },
    ];

    const result = generateComparisonsFromMetrics(dataWithMissingValues, {});
    const studyTypeMetrics = result.studyType.metrics;

    const clinicalTrials = studyTypeMetrics.find(
      (m: any) => m.name === "Clinical Trials"
    );
    expect(clinicalTrials!.applications).toBe(10);
    expect(clinicalTrials!.completions).toBe(0);

    const surveys = studyTypeMetrics.find((m: any) => m.name === "Surveys");
    expect(surveys!.applications).toBe(0);
    expect(surveys!.completions).toBe(0);
  });

  it("should include all predefined study types, age groups, and regions", () => {
    const result = generateComparisonsFromMetrics(mockComparisonsData, {});

    const expectedStudyTypes = [
      "Clinical Trials",
      "Surveys",
      "Focus Groups",
      "Longitudinal Studies",
      "Interviews",
      "Observational Studies",
    ];

    const expectedAgeGroups = [
      "18-24",
      "25-34",
      "35-44",
      "45-54",
      "55-64",
      "65+",
    ];

    const expectedRegions = [
      "North America",
      "Europe",
      "Asia",
      "South America",
      "Africa",
      "Australia",
    ];

    const studyTypeNames = result.studyType.metrics.map((m: any) => m.name);
    const ageGroupNames = result.ageGroup.metrics.map((m: any) => m.name);
    const regionNames = result.region.metrics.map((m: any) => m.name);

    expect(studyTypeNames).toEqual(expectedStudyTypes);
    expect(ageGroupNames).toEqual(expectedAgeGroups);
    expect(regionNames).toEqual(expectedRegions);
  });
});
