#!/bin/bash

echo "🚀 Starting Research Analytics Dashboard..."
echo ""

# Check if mock data exists
if [ ! -f "data/dailyMetrics.json" ]; then
    echo "📊 Generating mock data..."
    npm run generate:data
    echo ""
fi

echo "🔧 Installing dependencies..."
npm install
echo ""

echo "🌐 Starting development servers..."
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001"
echo "   API:      http://localhost:3001/api"
echo ""

npm run dev 