# Analytics Dashboard Technical Test

## Overview

This technical test involves building an analytics dashboard application for a research participation platform. The dashboard will help researchers and administrators visualize and analyze how participants engage with various research studies.

You'll be creating visualizations and metrics that track study participation rates, eligibility screening outcomes, completion rates, and demographic distributions across different research studies and time periods. The goal is to demonstrate your skills in frontend development with some backend integration.

## Requirements

### Frontend

- Create a responsive dashboard UI with at least 3 different visualization components (charts, graphs, etc.)
- Implement filters to allow users to view data by different dimensions (time periods, categories, etc.)
- Add data refresh functionality (polling or manual refresh)
- Use React and its ecosystem
- Create clean, maintainable code with appropriate component structure
- Implement responsive design that works well on different screen sizes
- **Performance Challenge**: Dashboard must efficiently display and filter through 50,000+ participant records using pagination, virtualization, or other performance strategies
- **Advanced Filtering**: Support simultaneous filtering across multiple dimensions (time range + study type + demographics + region + custom filters) with URL-persistent state

### Backend

- Create RESTful API endpoints to serve dashboard data
- Use Node and its ecosystem
- Implement data transformation/aggregation logic
- Add basic authentication for API access
- Include appropriate error handling

**Implement comprehensive tests for your application (unit tests for components and API endpoints, integration tests for key user flows)**

**Include a detailed explanation of your data architecture strategy for production scale in your documentation**

## Technical Specifications

### Dashboard Requirements

- The dashboard should include at least these visualization types:
  - Line chart (showing research participation trends over time)
  - Bar chart (comparing metrics across study types or demographics)
  - Summary cards/KPI indicators (showing key participation metrics)
  - At least one additional visualization of your choice
- Users should be able to filter data by:
  - Time range (e.g., last 7 days, 14 days, 30 days)
  - Study type (e.g., Clinical Trials, Surveys, Focus Groups)
  - Demographics (age groups, regions, etc.)
  - Multiple simultaneous filters that combine logically
- **Advanced Filtering Requirements**:
  - Support complex filter combinations (e.g., "Clinical Trials" AND "18-25 age group" AND "Last 30 days")
  - Maintain filter state in URL for sharing and bookmarking
  - Persist filter selections across page refreshes
  - Provide clear filter state visualization and easy filter removal
- Include a data refresh mechanism
- Provide visual feedback during data loading
- Implement a responsive design that works well on different screen sizes

### API Requirements

Design and implement a set of RESTful API endpoints that provide:

- Summary metrics for research participation (participant counts, completion rates, etc.)
- Time-series data for tracking trends over different time periods
- Comparative data across different dimensions (study types, regions, demographics, etc.)

Your API should:

- Include appropriate query parameters for filtering data
- Handle errors gracefully with appropriate status codes and messages
- Follow RESTful design principles
- **Performance Requirements**: Support efficient querying and filtering of large datasets (50,000+ records)
- **Advanced Query Support**: Handle complex filter combinations and return paginated results

### Data Structure

The application will work with research participation analytics data. Below are simplified examples of the data structure:

```json
// Example response for summary metrics
{
  "totalParticipants": 12500,
  "activeParticipants": 4200,
  "totalStudies": 48,
  "activeStudies": 18,
  "averageEligibilityRate": 32.5,
  "completionRate": 68.7
}

// Example response for trend data
{
  "timeRange": "7d",
  "interval": "day",
  "metrics": [
    {
      "name": "Study Applications",
      "data": [
        { "date": "2025-05-14", "value": 250 },
        { "date": "2025-05-15", "value": 280 },
        { "date": "2025-05-16", "value": 340 },
        { "date": "2025-05-17", "value": 270 },
        { "date": "2025-05-18", "value": 200 },
        { "date": "2025-05-19", "value": 310 },
        { "date": "2025-05-20", "value": 380 }
      ]
    },
    {
      "name": "Study Completions",
      "data": [
        { "date": "2025-05-14", "value": 180 },
        { "date": "2025-05-15", "value": 190 },
        { "date": "2025-05-16", "value": 210 },
        { "date": "2025-05-17", "value": 175 },
        { "date": "2025-05-18", "value": 140 },
        { "date": "2025-05-19", "value": 200 },
        { "date": "2025-05-20", "value": 220 }
      ]
    }
  ]
}

// Example response for comparison data
{
  "dimension": "studyType",
  "metrics": [
    {
      "name": "Clinical Trials",
      "applications": 1240,
      "completions": 380
    },
    {
      "name": "Surveys",
      "applications": 3800,
      "completions": 2800
    },
    {
      "name": "Focus Groups",
      "applications": 980,
      "completions": 480
    },
    {
      "name": "Longitudinal Studies",
      "applications": 750,
      "completions": 240
    }
  ]
}
```

## Getting Started

You will need to create your own project structure from scratch. This should include:

- A React frontend application
- A Node.js backend with the required API endpoints
- Mock data to populate the API responses

How you structure your project and which specific libraries you choose to use is up to you. This is part of the evaluation to see how you approach building a full-stack application.

### Mock Data

We've provided mock data to help you get started:

- The `/data` directory contains a TypeScript script that generates realistic mock data
- You can use this data directly or as a reference for creating your own data model
- The data structure aligns with the examples shown in this README
- Feel free to modify or extend the data to suit your implementation

## Evaluation Criteria

Your submission will be evaluated based on:

- Code quality and organization
- Component design and reusability
- User experience and interface design
- API implementation and data handling
- Error handling and edge cases
- Performance considerations (especially large dataset handling)
- Advanced filtering implementation and state management
- Testing coverage and quality
- Data architecture understanding and scalability considerations
- Problem-solving approach and technical decisions

## Deliverables

- Complete source code in a Git repository
- Instructions for running the application locally
- Brief documentation explaining your technical choices and architecture
- **Data Architecture Documentation**: Detailed explanation of how you would design the data persistence layer for production scale, including database choice, caching strategy, and query optimization approaches
- Comprehensive test suite with good coverage
- Notes on any features you would add or improve given more time

## Time Expectation

You will have one week to complete this test. While we estimate the core requirements could be completed in approximately 8-10 hours of focused work, we're providing a week to accommodate your schedule and allow time for thoughtful implementation.

We value quality over quantity, so focus on delivering a well-structured solution rather than implementing every possible feature. Use the time to demonstrate your best work and technical decision-making.

## Submission

Please submit your solution as a Git repository link. Make sure your repository is public or shared with the appropriate users.
