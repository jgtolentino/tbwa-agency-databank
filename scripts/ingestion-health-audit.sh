#!/bin/bash

# Ingestion Health Audit Script
# Validates Drive and Azure ingestion pipelines are active and flowing data

set -euo pipefail

echo "📊 Ingestion Health Audit"
echo "========================="
echo "Validating Drive and Azure data ingestion pipelines"
echo ""

ERRORS=0

# Helper functions
report_error() {
    echo "❌ ERROR: $1"
    ((ERRORS++))
}

report_success() {
    echo "✅ $1"
}

report_warning() {
    echo "⚠️ WARNING: $1"
}

# Validate database connection
if [ -z "${PG_URL_SCOUT:-}" ]; then
    report_error "PG_URL_SCOUT environment variable not set"
    exit 1
fi

echo "1️⃣ Google Drive Ingestion Health"
echo "================================="

echo "Checking Drive ingestion metrics..."

# Check for Drive ingestion activity in last 24h
DRIVE_FILES_24H=$(psql "$PG_URL_SCOUT" -t -A -c "
SELECT COALESCE(SUM(file_count), 0)
FROM drive_intelligence.ingestion_metrics_24h();" 2>/dev/null || echo "0")

echo "Drive files processed (24h): $DRIVE_FILES_24H"

if [ "$DRIVE_FILES_24H" -gt 0 ]; then
    report_success "Drive ingestion active: $DRIVE_FILES_24H files processed"
else
    report_warning "Drive ingestion inactive: 0 files processed in 24h"
fi

# Check Drive service account connectivity
echo "Testing Drive service account connectivity..."
DRIVE_SA_TEST=$(psql "$PG_URL_SCOUT" -t -A -c "
SELECT COUNT(*)
FROM drive_intelligence.service_account_status
WHERE last_successful_auth > NOW() - INTERVAL '24 hours';" 2>/dev/null || echo "0")

if [ "$DRIVE_SA_TEST" -gt 0 ]; then
    report_success "Drive service account authenticated recently"
else
    report_warning "Drive service account may need re-authentication"
fi

# Check for Drive processing errors
DRIVE_ERRORS_24H=$(psql "$PG_URL_SCOUT" -t -A -c "
SELECT COUNT(*)
FROM drive_intelligence.processing_errors
WHERE error_timestamp > NOW() - INTERVAL '24 hours';" 2>/dev/null || echo "0")

if [ "$DRIVE_ERRORS_24H" -eq 0 ]; then
    report_success "No Drive processing errors in 24h"
else
    report_warning "Drive processing errors (24h): $DRIVE_ERRORS_24H"
fi

echo ""
echo "2️⃣ Azure Stream Analytics Health"
echo "================================"

echo "Checking Azure ingestion metrics..."

# Check Azure stream events in last 5 minutes (real-time indicator)
AZURE_EVENTS_5M=$(psql "$PG_URL_SCOUT" -t -A -c "
SELECT COALESCE(COUNT(*), 0)
FROM staging.azure_stream_events
WHERE ingested_at > NOW() - INTERVAL '5 minutes';" 2>/dev/null || echo "0")

echo "Azure events (last 5m): $AZURE_EVENTS_5M"

if [ "$AZURE_EVENTS_5M" -gt 0 ]; then
    report_success "Azure streaming active: $AZURE_EVENTS_5M events in 5m"
else
    report_warning "Azure streaming may be inactive: 0 events in 5m"
fi

# Check Azure events in last hour for broader view
AZURE_EVENTS_1H=$(psql "$PG_URL_SCOUT" -t -A -c "
SELECT COALESCE(COUNT(*), 0)
FROM staging.azure_stream_events
WHERE ingested_at > NOW() - INTERVAL '1 hour';" 2>/dev/null || echo "0")

echo "Azure events (last 1h): $AZURE_EVENTS_1H"

if [ "$AZURE_EVENTS_1H" -gt 0 ]; then
    report_success "Azure ingestion flowing: $AZURE_EVENTS_1H events in 1h"
else
    report_warning "Azure ingestion may be stalled: 0 events in 1h"
fi

# Check Azure connection health
AZURE_CONNECTION_STATUS=$(psql "$PG_URL_SCOUT" -t -A -c "
SELECT COALESCE(connection_status, 'Unknown')
FROM azure_stream.connection_health
ORDER BY last_check_at DESC LIMIT 1;" 2>/dev/null || echo "Unknown")

echo "Azure connection status: $AZURE_CONNECTION_STATUS"

if [ "$AZURE_CONNECTION_STATUS" = "Healthy" ]; then
    report_success "Azure connection healthy"
else
    report_warning "Azure connection status: $AZURE_CONNECTION_STATUS"
fi

echo ""
echo "3️⃣ ETL Job Registry Health"
echo "=========================="

echo "Checking ETL job execution..."

# Check ETL jobs run in last 24h
ETL_RUNS_24H=$(psql "$PG_URL_SCOUT" -t -A -c "
SELECT COUNT(*)
FROM etl_job_registry
WHERE last_run_at > NOW() - INTERVAL '24 hours';" 2>/dev/null || echo "0")

echo "ETL job runs (24h): $ETL_RUNS_24H"

if [ "$ETL_RUNS_24H" -gt 0 ]; then
    report_success "ETL jobs active: $ETL_RUNS_24H runs in 24h"
else
    report_warning "ETL jobs may be stalled: 0 runs in 24h"
fi

# Check for ETL job failures
ETL_FAILURES_24H=$(psql "$PG_URL_SCOUT" -t -A -c "
SELECT COUNT(*)
FROM etl_job_registry
WHERE last_run_status = 'FAILED'
AND last_run_at > NOW() - INTERVAL '24 hours';" 2>/dev/null || echo "0")

if [ "$ETL_FAILURES_24H" -eq 0 ]; then
    report_success "No ETL job failures in 24h"
else
    report_warning "ETL job failures (24h): $ETL_FAILURES_24H"
fi

echo ""
echo "4️⃣ Medallion Architecture Health"
echo "================================"

echo "Checking medallion layer data flow..."

# Bronze layer (raw ingestion)
BRONZE_RECORDS=$(psql "$PG_URL_SCOUT" -t -A -c "
SELECT COALESCE(COUNT(*), 0)
FROM bronze.raw_transactions
WHERE ingested_at > NOW() - INTERVAL '24 hours';" 2>/dev/null || echo "0")

echo "Bronze layer records (24h): $BRONZE_RECORDS"

# Silver layer (cleaned data)
SILVER_RECORDS=$(psql "$PG_URL_SCOUT" -t -A -c "
SELECT COALESCE(COUNT(*), 0)
FROM silver.cleaned_transactions
WHERE processed_at > NOW() - INTERVAL '24 hours';" 2>/dev/null || echo "0")

echo "Silver layer records (24h): $SILVER_RECORDS"

# Gold layer (analytics-ready)
GOLD_RECORDS=$(psql "$PG_URL_SCOUT" -t -A -c "
SELECT COALESCE(COUNT(*), 0)
FROM public.gold_recent_transactions;" 2>/dev/null || echo "0")

echo "Gold layer total records: $GOLD_RECORDS"

# Check medallion flow ratios
if [ "$BRONZE_RECORDS" -gt 0 ] && [ "$SILVER_RECORDS" -gt 0 ]; then
    SILVER_RATIO=$(echo "scale=2; $SILVER_RECORDS * 100 / $BRONZE_RECORDS" | bc 2>/dev/null || echo "0")
    echo "Bronze→Silver conversion: ${SILVER_RATIO}%"

    if [ "$(echo "$SILVER_RATIO > 80" | bc 2>/dev/null)" = "1" ]; then
        report_success "Good Bronze→Silver conversion rate: ${SILVER_RATIO}%"
    else
        report_warning "Low Bronze→Silver conversion rate: ${SILVER_RATIO}%"
    fi
fi

if [ "$GOLD_RECORDS" -gt 0 ]; then
    report_success "Gold layer populated with $GOLD_RECORDS records"
else
    report_error "Gold layer empty - no analytics data available"
fi

echo ""
echo "5️⃣ Data Freshness Check"
echo "======================="

echo "Checking data freshness across layers..."

# Most recent data timestamps
LATEST_BRONZE=$(psql "$PG_URL_SCOUT" -t -A -c "
SELECT COALESCE(MAX(ingested_at), '1970-01-01')
FROM bronze.raw_transactions;" 2>/dev/null || echo "1970-01-01")

LATEST_SILVER=$(psql "$PG_URL_SCOUT" -t -A -c "
SELECT COALESCE(MAX(processed_at), '1970-01-01')
FROM silver.cleaned_transactions;" 2>/dev/null || echo "1970-01-01")

LATEST_GOLD=$(psql "$PG_URL_SCOUT" -t -A -c "
SELECT COALESCE(MAX(updated_at), '1970-01-01')
FROM public.gold_recent_transactions;" 2>/dev/null || echo "1970-01-01")

echo "Latest Bronze data: $LATEST_BRONZE"
echo "Latest Silver data: $LATEST_SILVER"
echo "Latest Gold data: $LATEST_GOLD"

# Check if data is fresh (within last 4 hours)
CURRENT_TIME=$(date -u +"%Y-%m-%d %H:%M:%S")
FOUR_HOURS_AGO=$(date -u -d "4 hours ago" +"%Y-%m-%d %H:%M:%S")

if [[ "$LATEST_GOLD" > "$FOUR_HOURS_AGO" ]]; then
    report_success "Gold data is fresh (within 4 hours)"
else
    report_warning "Gold data may be stale (older than 4 hours)"
fi

echo ""
echo "6️⃣ Ingestion Health Summary"
echo "==========================="

echo "Drive Ingestion:"
echo "  Files (24h): $DRIVE_FILES_24H"
echo "  Errors (24h): $DRIVE_ERRORS_24H"

echo "Azure Ingestion:"
echo "  Events (5m): $AZURE_EVENTS_5M"
echo "  Events (1h): $AZURE_EVENTS_1H"
echo "  Status: $AZURE_CONNECTION_STATUS"

echo "ETL Pipeline:"
echo "  Runs (24h): $ETL_RUNS_24H"
echo "  Failures (24h): $ETL_FAILURES_24H"

echo "Medallion Layers:"
echo "  Bronze (24h): $BRONZE_RECORDS"
echo "  Silver (24h): $SILVER_RECORDS"
echo "  Gold (total): $GOLD_RECORDS"

echo ""
if [ $ERRORS -eq 0 ]; then
    echo "🎯 INGESTION HEALTH: GOOD"
    echo "✅ Data pipelines are flowing"
    echo "✅ All critical ingestion systems operational"
    exit 0
else
    echo "⚠️ INGESTION HEALTH: NEEDS ATTENTION"
    echo "❌ $ERRORS critical issues detected"
    echo "🔧 Review ingestion pipeline configuration"
    exit 1
fi