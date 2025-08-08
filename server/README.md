# Server Architecture & Technical Documentation

This document outlines the technical choices, architecture, and implementation details for the research analytics dashboard backend server.

## Architecture Overview

The server follows a **modular architecture** with clear separation of concerns:

- **Express.js** for HTTP server and routing
- **TypeScript** for type safety and better developer experience
- **Modular helper functions** for business logic
- **Comprehensive testing** with Vitest
- **API Key authentication** for security

## Technical Choices

### 1. **Express.js Framework**

- **Choice**: Express.js for HTTP server
- **Rationale**: Lightweight, mature, excellent middleware ecosystem
- **Benefits**: Fast setup, extensive middleware, great for REST APIs

### 2. **TypeScript Implementation**

- **Choice**: Full TypeScript implementation
- **Rationale**: Type safety, better IDE support, reduced runtime errors
- **Benefits**: Catch errors at compile time, better refactoring support

### 3. **Modular Architecture**

- **Choice**: Separated business logic into `helpers.ts`
- **Rationale**: Single responsibility principle, easier testing
- **Benefits**: Reusable functions, isolated testing, maintainable code

### 4. **Authentication Strategy**

- **Choice**: API Key-based authentication
- **Rationale**: Simple, stateless, suitable for frontend-backend communication
- **Implementation**: Middleware that validates API key on `/api` routes

### 5. **Data Processing Strategy**

- **Choice**: Single-pass aggregation with Map data structures
- **Rationale**: O(n) performance, memory efficient
- **Benefits**: Scales well with large datasets, predictable performance

## File Structure

```
server/
├── index.ts          # Main server file (Express setup, routes)
├── helpers.ts        # Business logic functions
├── helpers.test.ts   # Comprehensive unit tests
├── index.types.ts    # TypeScript type definitions
└── README.md         # This documentation
```

## Core Components

### 1. **Server Setup (`index.ts`)**

**Responsibilities:**

- Express server configuration
- Middleware setup (CORS, authentication, error handling)
- Route definitions
- Static file serving

**Key Features:**

- API Key authentication middleware
- Comprehensive error handling
- CORS configuration for frontend
- Static file serving for React app

### 2. **Business Logic (`helpers.ts`)**

**Functions:**

- `filterDailyMetrics()` - Data filtering by criteria
- `aggregateData()` - Summary metrics calculation
- `validateQueryParams()` - Input validation
- `addMetricToMap()` - Efficient data aggregation
- `generateTrendsFromMetrics()` - Time-series data generation
- `generateComparisonsFromMetrics()` - Multi-dimensional analysis

**Design Principles:**

- **Single Responsibility**: Each function has one clear purpose
- **Pure Functions**: No side effects, predictable outputs
- **Performance Optimized**: Single-pass algorithms where possible
- **Error Resilient**: Graceful handling of edge cases

### 3. **Data Processing Architecture**

**Aggregation Strategy:**

```typescript
// Single-pass aggregation using Map
const dateMap = new Map<string, AggregatedData>();
for (const metric of filteredMetrics) {
  // Aggregate in one pass - O(n) performance
}
```

**Benefits:**

- **O(n) Performance**: Scales linearly with data size
- **Memory Efficient**: No intermediate arrays
- **Predictable**: Consistent performance characteristics

### 4. **API Design**

**RESTful Endpoints:**

- `GET /api/summary` - Dashboard summary metrics
- `GET /api/trends` - Time-series trend data
- `GET /api/comparisons` - Multi-dimensional comparisons
- `GET /api/filter-options` - Available filter options

**Response Format:**

```typescript
interface ApiResponse<T> {
  data?: T;
  error?: string;
  details?: string[];
}
```

## Security Implementation

### API Key Authentication

```typescript
const authenticateRequest = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};
```

**Security Features:**

- Environment variable configuration
- Middleware-based protection
- Scoped to `/api` routes only
- Clear error responses

## Data Flow Architecture

```
Client Request → Authentication → Validation → Processing → Response
     ↓              ↓              ↓           ↓          ↓
  Frontend    API Key Check   Query Params  Business    JSON
  (React)     (Middleware)    (Validation)   Logic     Response
```

### 1. **Request Processing**

- Client sends authenticated request
- Middleware validates API key
- Query parameters validated
- Data filtered based on criteria

### 2. **Data Processing**

- Single-pass aggregation algorithms
- Map-based data structures for efficiency
- Type-safe operations throughout

### 3. **Response Generation**

- Structured JSON responses
- Consistent error handling
- Type-safe response objects

## Performance Optimizations

### 1. **Algorithmic Efficiency**

- **O(n) Aggregation**: Single-pass data processing
- **Map Data Structures**: O(1) lookups for aggregations
- **Memory Efficient**: Minimal intermediate data structures

### 2. **Caching Strategy**

- **No Server-Side Caching**: Data is real-time
- **Client-Side Caching**: React handles UI state
- **Efficient Queries**: Filtered data processing

### 3. **Error Handling**

- **Graceful Degradation**: Handles missing/invalid data
- **Detailed Error Messages**: Helps with debugging
- **Type Safety**: Prevents runtime errors

## Testing Strategy

### 1. **Unit Testing (Vitest)**

- **Comprehensive Coverage**: All helper functions tested
- **Edge Case Testing**: Null, empty, invalid data scenarios
- **Performance Testing**: Large dataset handling

### 2. **Test Categories**

- **Functionality Tests**: Core business logic
- **Edge Case Tests**: Error conditions and boundaries
- **Integration Tests**: Function combinations
- **Performance Tests**: Large dataset handling

### 3. **Mock Data Strategy**

- **Realistic Scenarios**: Representative test data
- **Edge Cases**: Null, empty, invalid data
- **Performance Testing**: Large datasets

## Environment Configuration

### Required Environment Variables

```bash
API_KEY=your-secret-api-key
VITE_API_KEY=your-secret-api-key
PORT=3001
```

### Configuration Files

- `.env` - Server environment variables
- `env.example` - Template for environment setup

## Deployment Considerations

### 1. **Environment Setup**

- Secure API key generation
- Environment variable configuration
- Port configuration

### 2. **Security Best Practices**

- API key rotation capability
- HTTPS in production
- Rate limiting (future enhancement)

### 3. **Monitoring & Logging**

- Error logging for debugging
- Performance monitoring (future enhancement)
- Health check endpoints (future enhancement)

## Future Enhancements

### 1. **Performance**

- Database integration for large datasets
- Redis caching for frequently accessed data
- Query optimization for complex filters

### 2. **Security**

- Rate limiting middleware
- Request validation enhancement
- Audit logging

### 3. **Scalability**

- Horizontal scaling support
- Load balancing configuration
- Microservices architecture (if needed)

## Development Workflow

### 1. **Local Development**

```bash
npm run dev          # Start development server
npm test            # Run all tests
npm test -- --watch # Run tests in watch mode
```

### 2. **Code Quality**

- TypeScript strict mode enabled
- ESLint configuration
- Pre-commit hooks (future enhancement)

### 3. **Testing Strategy**

- Unit tests for all helper functions
- Integration tests for API endpoints
- Performance tests for large datasets

This architecture provides a solid foundation for the research analytics dashboard, with clear separation of concerns, comprehensive testing, and room for future enhancements.
