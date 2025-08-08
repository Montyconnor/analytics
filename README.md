# Research Analytics Dashboard

A modern, responsive dashboard for displaying research analytics data with real-time filtering and interactive charts.

## 🚀 Features

- **Real-time Data Filtering**: Filter data by time range, study type, age group, and region
- **Interactive Charts**: Bar charts, pie charts, and trend line charts using Recharts
- **Responsive Design**: Adapts to different screen sizes with mobile-first approach
- **Performance Optimized**: Uses React.memo for efficient re-renders and optimized data fetching
- **TypeScript Support**: Full type safety throughout the application
- **API Authentication**: Secure API key-based authentication
- **Modern Stack**: React 18, Vite, Express, TypeScript

## 🏗️ Architecture

### Frontend (React + TypeScript)

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Charts**: Recharts for interactive data visualization
- **Styling**: CSS with responsive grid system
- **State Management**: React hooks with optimized re-rendering

### Backend (Node.js + Express)

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js with middleware support
- **Authentication**: API key-based authentication
- **Data**: Mock data generation with Faker.js
- **Performance**: Compression and caching headers

## 🔐 API Authentication

This application uses API key authentication to ensure only the React frontend can interact with the backend server.

### Setup

1. **Option A: Automated Setup** (Recommended):

   ```bash
   npm run setup:auth
   ```

2. **Option B: Manual Setup**:

   - **Create Environment File**: Copy the example environment file:

     ```bash
     cp env.example .env
     ```

   - **Set API Key**: Edit the `.env` file and set a secure API key:
     ```bash
     API_KEY=your-secure-api-key-here
     VITE_API_KEY=your-secure-api-key-here
     ```

3. **Security Notes**:
   - The API key should be a strong, random string
   - Never commit the `.env` file to version control
   - In production, use environment variables or secure key management
   - The same key must be set for both frontend (`VITE_API_KEY`) and backend (`API_KEY`)

### How It Works

- **Backend**: All API routes are protected by authentication middleware
- **Frontend**: All API calls automatically include the API key in headers
- **Static Files**: Authentication is bypassed for static assets and the main app route
- **Error Handling**: Invalid or missing API keys return appropriate HTTP status codes

### API Key Headers

The frontend sends the API key in the `X-API-Key` header:

```
X-API-Key: your-secure-api-key-here
```

## 📊 Components

### Core Components

- **`SummaryMetrics`**: Displays key performance indicators in a responsive grid

  - Total Participants, Active Participants, Total Studies, Active Studies
  - Average Eligibility Rate, Completion Rate
  - Uses Lucide React icons for visual appeal

- **`TrendsChart`**: Interactive line chart for time-series data

  - Supports multiple time ranges (7d, 14d, 30d)
  - Shows Study Applications, Completions, and New Participants over time
  - Responsive design with tooltips and legends

- **`ComparisonCharts`**: Multi-dimensional data comparison

  - Study Type Performance (Bar Chart)
  - Age Group Performance (Pie Charts or Bar Chart)
  - Toggle between merged and split views
  - Configurable chart types and layouts

- **`DataFilters`**: Interactive filtering interface
  - Time Range selector (7d, 14d, 30d)
  - Study Type filter (Clinical Trials, Surveys, Focus Groups, etc.)
  - Age Group filter (18-24, 25-34, 35-44, etc.)
  - Region filter (North America, Europe, Asia, etc.)
  - Real-time URL parameter updates

### Chart Components

- **`BarChart`**: Configurable bar chart component

  - Supports applications and completions data
  - Customizable colors and formatting
  - Responsive design with tooltips

- **`PieChart`**: Interactive pie chart with legend
  - Custom tooltips and color schemes
  - Responsive layout with legend positioning
  - Empty state handling

## 🎨 Layout System

The dashboard uses a flexible, responsive layout system:

### Grid Layout

- **Summary Metrics**: 3-column grid on desktop, stacks on mobile
- **Charts**: Full-width cards with consistent spacing
- **Filters**: Sticky header with horizontal layout
- **Responsive**: Mobile-first approach with breakpoints

### Design System

- **Colors**: Consistent color palette for charts and UI
- **Typography**: Clean, readable font hierarchy
- **Spacing**: Consistent spacing using CSS custom properties
- **Cards**: Elevated card design with subtle shadows

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd tt-20-05-25
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up authentication**:

   ```bash
   npm run setup:auth
   ```

4. **Start development server**:

   ```bash
   npm run dev
   ```

5. **Open your browser**:
   ```
   http://localhost:5173
   ```

### Available Scripts

- `npm run dev` - Start development server (frontend + backend)
- `npm run dev:client` - Start frontend only
- `npm run dev:server` - Start backend only
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run generate:data` - Generate mock data

## 📁 Project Structure

```
tt-20-05-25/
├── src/
│   ├── components/
│   │   ├── SummaryMetrics/     # Key performance indicators
│   │   ├── TrendsChart/        # Time-series line charts
│   │   ├── ComparisonCharts/   # Multi-dimensional comparisons
│   │   ├── DataFilters/        # Interactive filtering
│   │   ├── BarChart/          # Reusable bar chart
│   │   └── PieChart/          # Reusable pie chart
│   ├── App.tsx                # Main application component
│   ├── config.ts              # API configuration
│   └── index.css              # Global styles
├── server/
│   ├── helpers.ts             # Data processing utilities
│   ├── index.ts               # Express server
│   └── index.types.ts         # TypeScript types
├── data/
│   └── generateMockData.ts    # Mock data generation
└── scripts/
    └── setup-auth.sh          # Authentication setup
```

## 🧪 Testing

The project includes comprehensive tests for all components:

- **Unit Tests**: Component testing with Vitest and React Testing Library
- **Integration Tests**: API endpoint testing
- **Type Safety**: Full TypeScript coverage

Run tests with:

```bash
npm test
```

## 🔧 Configuration

### Environment Variables

- `PORT` - Server port (default: 3001)
- `API_KEY` - Backend API key
- `VITE_API_KEY` - Frontend API key
- `NODE_ENV` - Environment mode

### API Endpoints

- `GET /api/summary` - Summary metrics data
- `GET /api/trends` - Time-series trends data
- `GET /api/comparisons` - Comparison data
- `GET /api/filters` - Available filter options

## 🎯 Performance Features

- **Memoization**: React.memo for component optimization
- **Lazy Loading**: Efficient data fetching
- **Bundle Optimization**: Vite for fast builds and HMR

## 📱 Responsive Design

- **Desktop**: Full 3-column grid layout
- **Tablet**: Adaptive grid with reduced spacing
- **Mobile**: Single-column layout with touch-friendly controls

## 🔄 Data Flow

1. **Initial Load**: Dashboard loads with default filters (30d, all types)
2. **Filter Changes**: URL parameters update, triggering new API calls
3. **Data Fetching**: Optimized parallel API requests
4. **State Management**: React hooks with refs for performance
5. **Rendering**: Memoized components prevent unnecessary re-renders
