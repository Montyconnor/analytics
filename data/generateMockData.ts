import { faker } from "@faker-js/faker";
import fs from "fs";
import path from "path";

// Define study types
const STUDY_TYPES = [
  "Clinical Trials",
  "Surveys",
  "Focus Groups",
  "Longitudinal Studies",
  "Interviews",
  "Observational Studies",
];

// Define age groups
const AGE_GROUPS = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"];

// Define regions
const REGIONS = [
  "North America",
  "Europe",
  "Asia",
  "South America",
  "Africa",
  "Australia",
];

// Generate daily metrics data (matches daily_metrics table)
const generateDailyMetrics = () => {
  const dailyMetrics: any[] = [];

  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    // Generate metrics for each study type, age group, and region combination
    STUDY_TYPES.forEach((studyType) => {
      AGE_GROUPS.forEach((ageGroup) => {
        REGIONS.forEach((region) => {
          // Only add record if there's activity (randomly decide)
          if (faker.datatype.boolean({ probability: 0.3 })) {
            dailyMetrics.push({
              date: dateStr,
              studyId: faker.string.uuid(),
              studyType,
              ageGroup,
              region,
              applicationsCount: faker.number.int({ min: 0, max: 50 }),
              completionsCount: faker.number.int({ min: 0, max: 30 }),
              newParticipantsCount: faker.number.int({ min: 0, max: 20 }),
              createdAt: new Date().toISOString(),
            });
          }
        });
      });
    });
  }

  return dailyMetrics;
};

// Generate filter options
const generateFilterOptions = () => {
  return {
    studyTypes: STUDY_TYPES,
    ageGroups: AGE_GROUPS,
    regions: REGIONS,
    timeRanges: ["7d", "14d", "30d"],
  };
};

// Main generation function
const generateMockData = () => {
  console.log("Generating daily metrics...");
  const dailyMetrics = generateDailyMetrics();

  console.log("Generating filter options...");
  const filterOptions = generateFilterOptions();

  return {
    dailyMetrics,
    filterOptions,
  };
};

// Generate and save data
const mockData = generateMockData();

// Save to JSON files
const outputDir = path.join(__dirname);

// Save only the files that the server actually uses
fs.writeFileSync(
  path.join(outputDir, "dailyMetrics.json"),
  JSON.stringify(mockData.dailyMetrics, null, 2)
);

fs.writeFileSync(
  path.join(outputDir, "filterOptions.json"),
  JSON.stringify(mockData.filterOptions, null, 2)
);

console.log("Mock data generated successfully!");
console.log(`Generated ${mockData.dailyMetrics.length} daily metrics`);
console.log(
  `Generated filter options for ${mockData.filterOptions.studyTypes.length} study types, ${mockData.filterOptions.ageGroups.length} age groups, and ${mockData.filterOptions.regions.length} regions`
);
