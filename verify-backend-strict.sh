#!/bin/bash
# verify-backend-strict.sh – Rigorous static mock/fake backend pattern detection

set -e

echo "🔍 STRICT Backend Verification - Zero Tolerance for Mock Patterns"
echo "================================================================"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

FAIL_COUNT=0
WARN_COUNT=0

echo -e "\n1. Scanning for mock/fake/static patterns..."
echo "---------------------------------------------"

# Critical patterns that should NEVER exist in production WITHOUT conditioning
CRITICAL_PATTERNS=(
  "mockData(?!.*import\.meta\.env\.DEV)"
  "fakeData(?!.*import\.meta\.env\.DEV)"
  "generateMock(?!.*import\.meta\.env\.DEV)"
  "Promise.resolve.*mock"
  "setTimeout.*mock"
  "staticResponse"
  "hardcodedData"
  "dummyData"
  "testData"
  "sampleData"
)

# Check each critical pattern
for pattern in "${CRITICAL_PATTERNS[@]}"; do
  echo -n "Checking for '$pattern'... "
  COUNT=$(grep -r "$pattern" ./src --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" 2>/dev/null | grep -v "test\|spec\|\.test\." | wc -l || echo 0)
  
  if [ $COUNT -gt 0 ]; then
    echo -e "${RED}FAIL (found $COUNT occurrences)${NC}"
    FAIL_COUNT=$((FAIL_COUNT + COUNT))
    grep -r "$pattern" ./src --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" 2>/dev/null | grep -v "test\|spec\|\.test\." | head -3
  else
    echo -e "${GREEN}PASS${NC}"
  fi
done

echo -e "\n2. Checking for conditional mock usage..."
echo "------------------------------------------"

# Patterns that are OK only if properly conditioned
CONDITIONAL_PATTERNS=(
  "process.env.NODE_ENV.*development.*mock"
  "process.env.USE_MOCK"
  "import.meta.env.VITE_USE_MOCK"
)

for pattern in "${CONDITIONAL_PATTERNS[@]}"; do
  echo -n "Checking conditional pattern '$pattern'... "
  COUNT=$(grep -rE "$pattern" ./src --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" 2>/dev/null | wc -l || echo 0)
  
  if [ $COUNT -gt 0 ]; then
    echo -e "${YELLOW}WARNING (found $COUNT - verify they're properly conditioned)${NC}"
    WARN_COUNT=$((WARN_COUNT + COUNT))
  else
    echo -e "${GREEN}Not found${NC}"
  fi
done

echo -e "\n3. Checking for hardcoded responses..."
echo "---------------------------------------"

# Check for suspiciously static data patterns
STATIC_PATTERNS=(
  "return.*\{.*score:.*[0-9]"
  "return.*\{.*data:.*\["
  "export const.*Data.*="
  "const response.*=.*\{"
)

for pattern in "${STATIC_PATTERNS[@]}"; do
  echo -n "Checking for '$pattern'... "
  COUNT=$(grep -rE "$pattern" ./src --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" 2>/dev/null | grep -v "test\|spec\|config\|types\|interface" | wc -l || echo 0)
  
  if [ $COUNT -gt 5 ]; then
    echo -e "${YELLOW}WARNING (found $COUNT - might indicate static data)${NC}"
    WARN_COUNT=$((WARN_COUNT + 1))
  else
    echo -e "${GREEN}OK${NC}"
  fi
done

echo -e "\n4. Verifying API service patterns..."
echo "-------------------------------------"

# Check for proper API calls
echo -n "Checking for fetch/axios API calls... "
API_CALLS=$(grep -rE "fetch\(|axios\.|http\." ./src/services ./src/api 2>/dev/null | grep -v "mock\|test" | wc -l || echo 0)

if [ $API_CALLS -gt 0 ]; then
  echo -e "${GREEN}PASS (found $API_CALLS API calls)${NC}"
else
  echo -e "${RED}FAIL (no API calls found)${NC}"
  FAIL_COUNT=$((FAIL_COUNT + 1))
fi

echo -e "\n5. Checking environment configuration..."
echo "-----------------------------------------"

# Check for proper environment setup
if [ -f ".env.example" ]; then
  echo -n "Checking for API URL configuration... "
  if grep -q "API_URL\|BACKEND_URL\|API_BASE_URL" .env.example; then
    echo -e "${GREEN}PASS${NC}"
  else
    echo -e "${YELLOW}WARNING (no API URL config found)${NC}"
    WARN_COUNT=$((WARN_COUNT + 1))
  fi
fi

echo -e "\n6. Production build verification..."
echo "------------------------------------"

# Check if mock imports are excluded from production
echo -n "Checking for production build safeguards... "
if grep -rq "import.*mock.*production === false" ./src 2>/dev/null || grep -rq "!production.*mock" ./src 2>/dev/null; then
  echo -e "${GREEN}PASS (mock imports are conditioned)${NC}"
else
  echo -e "${YELLOW}WARNING (ensure mocks are excluded from prod builds)${NC}"
  WARN_COUNT=$((WARN_COUNT + 1))
fi

echo -e "\n========================================"
echo "📊 VERIFICATION SUMMARY"
echo "========================================"

if [ $FAIL_COUNT -eq 0 ] && [ $WARN_COUNT -eq 0 ]; then
  echo -e "${GREEN}✅ PASSED: No critical issues found${NC}"
  echo "The codebase appears to use real backend integration."
  exit 0
elif [ $FAIL_COUNT -eq 0 ]; then
  echo -e "${YELLOW}⚠️  PASSED WITH WARNINGS: $WARN_COUNT warnings found${NC}"
  echo "Review warnings above to ensure proper backend integration."
  exit 0
else
  echo -e "${RED}❌ FAILED: $FAIL_COUNT critical issues, $WARN_COUNT warnings${NC}"
  echo "Critical mock/static patterns detected. This may not be a real backend integration."
  exit 1
fi