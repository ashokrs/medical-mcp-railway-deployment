API Endpoint Tests
======================
Test Drug Search:
.....................
bashcurl -X POST http://localhost:3001/api/drugs/search \
  -H "Content-Type: application/json" \
  -d '{"query": "aspirin", "limit": 3}'

Test Health Statistics:
.....................
bashcurl -X POST http://localhost:3001/api/health/statistics \
  -H "Content-Type: application/json" \
  -d '{"indicator": "life expectancy", "country": "USA", "limit": 5}'

Test Literature Search:
.....................
bashcurl -X POST http://localhost:3001/api/literature/search \
  -H "Content-Type: application/json" \
  -d '{"query": "breast cancer", "max_results": 5}'

Test Breast Cancer Drugs:
.....................
bashcurl -X POST http://localhost:3001/api/breast-cancer/drugs

List Available Tools:
.....................
bashcurl http://localhost:3001/api/tools
