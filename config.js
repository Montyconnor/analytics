module.exports = {
  development: {
    port: 3001,
    apiBaseUrl: 'http://localhost:3001/api',
    corsOrigin: 'http://localhost:3000'
  },
  production: {
    port: process.env.PORT || 3001,
    apiBaseUrl: process.env.API_BASE_URL || '/api',
    corsOrigin: process.env.CORS_ORIGIN || '*'
  }
}; 