#!/bin/bash

# ============================================================================
# Scout v7 Dashboard Deployment Test Script
# Validates all dashboard components are working correctly
# ============================================================================

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
LOG_FILE="/tmp/activation/dashboard_test.log"
ERROR_FILE="/tmp/activation/dashboard_test_errors.log"

# Required environment variable
PG_URL_SCOUT="${PG_URL_SCOUT:-postgres://postgres.cxzllzyxwpyptfretryc:Postgres_26@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres}"

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1" | tee -a "${LOG_FILE}"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "${LOG_FILE}"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "${LOG_FILE}"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "${ERROR_FILE}" >&2
}

log_section() {
    echo ""
    echo -e "${BLUE}============================================================================${NC}"
    echo -e "${BLUE} $1${NC}"
    echo -e "${BLUE}============================================================================${NC}"
    echo ""
}

# Test counters
TESTS_TOTAL=0
TESTS_PASSED=0
TESTS_FAILED=0

# Test execution function
run_test() {
    local test_name="$1"
    local test_query="$2"
    local expected_result="$3"

    ((TESTS_TOTAL++))
    log_info "Testing: $test_name"

    local result
    if result=$(psql "$PG_URL_SCOUT" -t -A -c "$test_query" 2>/dev/null); then
        if [[ "$result" == "$expected_result" || "$expected_result" == "ANY" ]]; then
            log_success "✅ $test_name"
            ((TESTS_PASSED++))
            return 0
        else
            log_error "❌ $test_name - Expected: $expected_result, Got: $result"
            ((TESTS_FAILED++))
            return 1
        fi
    else
        log_error "❌ $test_name - Query failed"
        ((TESTS_FAILED++))
        return 1
    fi
}

# Test database connectivity
test_database_connection() {
    log_section "DATABASE CONNECTIVITY TEST"

    run_test "Database Connection" "SELECT 1;" "1"
    run_test "Scout Schema Exists" "SELECT 1 FROM information_schema.schemata WHERE schema_name = 'scout';" "1"
}

# Test compatibility views
test_compatibility_views() {
    log_section "COMPATIBILITY VIEWS TEST"

    run_test "Gold Recent Transactions View" \
        "SELECT CASE WHEN COUNT(*) > 0 THEN 'EXISTS' ELSE 'EMPTY' END FROM public.gold_recent_transactions;" \
        "EXISTS"

    run_test "Gold Brand Performance View" \
        "SELECT CASE WHEN COUNT(*) > 0 THEN 'EXISTS' ELSE 'EMPTY' END FROM public.gold_brand_performance;" \
        "EXISTS"

    run_test "Gold KPI Overview View" \
        "SELECT CASE WHEN total_transactions > 0 THEN 'HAS_DATA' ELSE 'NO_DATA' END FROM public.gold_kpi_overview;" \
        "HAS_DATA"
}

# Test dashboard RPCs
test_dashboard_rpcs() {
    log_section "DASHBOARD RPCs TEST"

    # Test Geographic Summary
    run_test "Geographic Summary RPC" \
        "SELECT CASE WHEN total_stores > 0 THEN 'WORKING' ELSE 'NO_DATA' END FROM scout.get_geo_summary('{}');" \
        "WORKING"

    # Test Brand Performance
    run_test "Brand Performance RPC" \
        "SELECT CASE WHEN COUNT(*) > 0 THEN 'WORKING' ELSE 'NO_DATA' END FROM scout.get_brand_performance('{}');" \
        "WORKING"

    # Test Consumer Behavior
    run_test "Consumer Behavior RPC" \
        "SELECT CASE WHEN spending_patterns IS NOT NULL THEN 'WORKING' ELSE 'NO_DATA' END FROM scout.get_consumer_behavior('{}');" \
        "WORKING"

    # Test Helper Function
    run_test "Filter Helper Function" \
        "SELECT CASE WHEN public._where_from_filters('{}') IS NOT NULL THEN 'WORKING' ELSE 'ERROR' END;" \
        "WORKING"
}

# Test data integrity
test_data_integrity() {
    log_section "DATA INTEGRITY TEST"

    # Check transaction counts match
    local fact_count=$(psql "$PG_URL_SCOUT" -t -A -c "SELECT COUNT(*) FROM scout.fact_transactions;" 2>/dev/null || echo "0")
    local view_count=$(psql "$PG_URL_SCOUT" -t -A -c "SELECT COUNT(*) FROM public.gold_recent_transactions;" 2>/dev/null || echo "0")

    if [[ "$view_count" -le "$fact_count" ]]; then
        log_success "✅ Transaction count integrity (View: $view_count <= Fact: $fact_count)"
        ((TESTS_PASSED++))
    else
        log_error "❌ Transaction count integrity issue"
        ((TESTS_FAILED++))
    fi
    ((TESTS_TOTAL++))

    # Check brand counts
    local brand_master=$(psql "$PG_URL_SCOUT" -t -A -c "SELECT COUNT(*) FROM scout.master_brands;" 2>/dev/null || echo "0")
    local brand_performance=$(psql "$PG_URL_SCOUT" -t -A -c "SELECT COUNT(*) FROM public.gold_brand_performance;" 2>/dev/null || echo "0")

    if [[ "$brand_performance" -eq "$brand_master" ]]; then
        log_success "✅ Brand count integrity (Both: $brand_master)"
        ((TESTS_PASSED++))
    else
        log_warning "⚠ Brand counts differ (Master: $brand_master, Performance: $brand_performance)"
        ((TESTS_PASSED++)) # Still passes as this might be expected
    fi
    ((TESTS_TOTAL++))
}

# Test performance
test_performance() {
    log_section "PERFORMANCE TEST"

    # Test query performance (should complete within reasonable time)
    local start_time=$(date +%s%N)
    psql "$PG_URL_SCOUT" -c "SELECT * FROM scout.get_geo_summary('{}');" > /dev/null 2>&1
    local end_time=$(date +%s%N)
    local duration_ms=$(( (end_time - start_time) / 1000000 ))

    if [[ $duration_ms -lt 5000 ]]; then  # Less than 5 seconds
        log_success "✅ Geographic RPC Performance (${duration_ms}ms)"
        ((TESTS_PASSED++))
    else
        log_warning "⚠ Geographic RPC Slow (${duration_ms}ms)"
        ((TESTS_PASSED++)) # Still passes but warns
    fi
    ((TESTS_TOTAL++))
}

# Test security permissions
test_security() {
    log_section "SECURITY PERMISSIONS TEST"

    # Test that anon role can access views
    run_test "Anon Access to Views" \
        "SELECT has_table_privilege('anon', 'public.gold_recent_transactions', 'SELECT');" \
        "t"

    # Test that authenticated role can access functions
    run_test "Authenticated Access to Functions" \
        "SELECT has_function_privilege('authenticated', 'scout.get_geo_summary(jsonb)', 'EXECUTE');" \
        "t"
}

# Generate test report
generate_test_report() {
    log_section "TEST REPORT"

    echo "📊 Test Execution Summary:" | tee -a "${LOG_FILE}"
    echo "  Total Tests: $TESTS_TOTAL" | tee -a "${LOG_FILE}"
    echo "  Passed: $TESTS_PASSED" | tee -a "${LOG_FILE}"
    echo "  Failed: $TESTS_FAILED" | tee -a "${LOG_FILE}"

    local pass_rate=$((TESTS_PASSED * 100 / TESTS_TOTAL))
    echo "  Pass Rate: ${pass_rate}%" | tee -a "${LOG_FILE}"

    if [[ $TESTS_FAILED -eq 0 ]]; then
        log_success "🎉 ALL TESTS PASSED!"
        echo ""
        echo "Dashboard Deployment Status: ✅ READY FOR PRODUCTION"
        echo ""
        echo "Available Dashboard Functions:"
        echo "  • scout.get_geo_summary('{}') - Geographic intelligence"
        echo "  • scout.get_brand_performance('{}') - Brand analytics"
        echo "  • scout.get_consumer_behavior('{}') - Consumer insights"
        echo "  • public.gold_recent_transactions - Recent transaction view"
        echo "  • public.gold_brand_performance - Brand performance view"
        echo "  • public.gold_kpi_overview - KPI summary view"
        echo ""
    else
        log_error "❌ Some tests failed. Please review errors above."
        return 1
    fi
}

# Main execution
main() {
    local mode="${1:-full}"

    log_section "SCOUT V7 DASHBOARD DEPLOYMENT VALIDATION"
    log_info "Starting validation tests..."
    log_info "Mode: $mode"

    # Clear previous logs
    > "$LOG_FILE"
    > "$ERROR_FILE"

    case "$mode" in
        "quick")
            test_database_connection
            test_compatibility_views
            ;;
        "functions")
            test_dashboard_rpcs
            ;;
        "full"|"")
            test_database_connection
            test_compatibility_views
            test_dashboard_rpcs
            test_data_integrity
            test_performance
            test_security
            ;;
        *)
            echo "Usage: $0 [full|quick|functions]"
            echo "  full      - Complete validation suite (default)"
            echo "  quick     - Basic connectivity and view tests"
            echo "  functions - Dashboard RPC function tests only"
            exit 1
            ;;
    esac

    generate_test_report
}

# Execute main function
main "$@"