#!/bin/bash

echo "🔐 Setting up API Authentication..."
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "✅ .env file created"
else
    echo "ℹ️  .env file already exists"
fi

echo ""
echo "🔑 Generating secure API key..."
API_KEY=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)

# Update the .env file with the new API key
sed -i '' "s/API_KEY=.*/API_KEY=$API_KEY/" .env
sed -i '' "s/VITE_API_KEY=.*/VITE_API_KEY=$API_KEY/" .env

echo "✅ API key generated and updated in .env file"
echo ""
echo "🔒 Authentication setup complete!"
echo "   - API key: $API_KEY"
echo "   - Backend will use: API_KEY"
echo "   - Frontend will use: VITE_API_KEY"
echo ""
echo "🚀 You can now start the development server with: npm run dev" 