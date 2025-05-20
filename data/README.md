# Mock Data Generator for Research Participation Analytics

This directory contains a TypeScript script that generates realistic mock data for a research participation analytics dashboard.

## Data Structure

The generator creates the following data files:

- `mockData.json` - Complete dataset with all metrics
- `summary.json` - Basic summary metrics (participant counts, rates, etc.)
- `trends.json` - Time-series data for tracking metrics over time
- `comparisons.json` - Comparative data across different dimensions (study types, age groups)

This will create/update all the JSON files with fresh mock data.

## Customizing the Data

You can modify the script to adjust:

- The range of random values
- The number of data points
- The study types, age groups, regions, etc.
- Any additional metrics you'd like to include

## Using the Mock Data in Your Application

You can use these JSON files directly in your frontend application for development and testing.

For the backend implementation, you can:

1. Serve these JSON files directly
2. Import them into your server code
3. Use them as a reference for creating your own data model

Each file is structured to match the example data shown in the main README.
