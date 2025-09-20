-- Data Quality Health Views for Scout Dashboard
-- Create comprehensive DQ views for real-time health monitoring

-- Create DQ schema if not exists
CREATE SCHEMA IF NOT EXISTS dq;

-- Drop existing views if they exist
DROP VIEW IF EXISTS dq.v_data_health_summary CASCADE;
DROP VIEW IF EXISTS dq.v_data_health_issues CASCADE;
DROP VIEW IF EXISTS dq.v_etl_activity_stream CASCADE;

-- 1. Data Health Summary View
-- Real-time KPIs for dashboard cards
CREATE OR REPLACE VIEW dq.v_data_health_summary AS
WITH stats AS (
  SELECT
    COUNT(*) as total_records,
    COUNT(CASE WHEN source = 'azure' THEN 1 END) as azure_records,
    COUNT(CASE WHEN source = 'ps2' THEN 1 END) as ps2_records,
    COUNT(CASE WHEN source = 'edge' THEN 1 END) as edge_records,
    COUNT(CASE WHEN effective_ts IS NULL THEN 1 END) as null_timestamps,
    COUNT(CASE WHEN store_id IS NULL THEN 1 END) as null_stores,
    COUNT(CASE WHEN amount IS NULL OR amount <= 0 THEN 1 END) as null_amounts,
    COUNT(CASE WHEN canonical_tx_id IS NULL THEN 1 END) as null_canonical,
    COUNT(DISTINCT canonical_tx_id) as unique_transactions,
    MAX(effective_ts) as latest_transaction,
    MIN(effective_ts) as earliest_transaction
  FROM silver.sales_interactions
  WHERE effective_ts IS NOT NULL
),
quality_score AS (
  SELECT
    CASE
      WHEN null_timestamps = 0 AND null_stores = 0 AND null_amounts < total_records * 0.05 THEN 'EXCELLENT'
      WHEN null_timestamps < total_records * 0.01 AND null_stores < total_records * 0.05 THEN 'GOOD'
      WHEN null_timestamps < total_records * 0.05 AND null_stores < total_records * 0.10 THEN 'FAIR'
      ELSE 'POOR'
    END as overall_grade,
    ROUND(100.0 * (total_records - null_timestamps) / NULLIF(total_records, 0), 1) as timestamp_quality,
    ROUND(100.0 * (total_records - null_stores) / NULLIF(total_records, 0), 1) as store_quality,
    ROUND(100.0 * (total_records - null_amounts) / NULLIF(total_records, 0), 1) as amount_quality,
    ROUND(100.0 * unique_transactions / NULLIF(total_records, 0), 1) as uniqueness_ratio
  FROM stats
)
SELECT
  s.total_records,
  s.azure_records,
  s.ps2_records,
  s.edge_records,
  s.unique_transactions,
  s.total_records - s.unique_transactions as potential_duplicates,
  q.overall_grade,
  q.timestamp_quality,
  q.store_quality,
  q.amount_quality,
  q.uniqueness_ratio,
  s.latest_transaction,
  s.earliest_transaction,
  EXTRACT(EPOCH FROM (s.latest_transaction - s.earliest_transaction))/86400 as data_span_days,
  now() as calculated_at
FROM stats s
CROSS JOIN quality_score q;

-- 2. Data Health Issues View
-- Specific data quality issues for monitoring
CREATE OR REPLACE VIEW dq.v_data_health_issues AS
WITH issue_detection AS (
  SELECT
    'Missing Timestamps' as issue_type,
    'CRITICAL' as severity,
    COUNT(*) as affected_records,
    'effective_ts IS NULL' as condition_desc,
    'PS2/Edge timestamp fallback needed' as resolution
  FROM silver.sales_interactions
  WHERE effective_ts IS NULL

  UNION ALL

  SELECT
    'Missing Store IDs' as issue_type,
    'HIGH' as severity,
    COUNT(*) as affected_records,
    'store_id IS NULL' as condition_desc,
    'Device-to-store mapping required' as resolution
  FROM silver.sales_interactions
  WHERE store_id IS NULL

  UNION ALL

  SELECT
    'Invalid Amounts' as issue_type,
    'MEDIUM' as severity,
    COUNT(*) as affected_records,
    'amount IS NULL OR amount <= 0' as condition_desc,
    'Price mapping from items array' as resolution
  FROM silver.sales_interactions
  WHERE amount IS NULL OR amount <= 0

  UNION ALL

  SELECT
    'Missing Canonical IDs' as issue_type,
    'CRITICAL' as severity,
    COUNT(*) as affected_records,
    'canonical_tx_id IS NULL' as condition_desc,
    'Regenerate canonical IDs' as resolution
  FROM silver.sales_interactions
  WHERE canonical_tx_id IS NULL

  UNION ALL

  SELECT
    'Potential Duplicates' as issue_type,
    'MEDIUM' as severity,
    COUNT(*) - COUNT(DISTINCT canonical_tx_id) as affected_records,
    'Duplicate canonical_tx_id values' as condition_desc,
    'Review canonical ID generation logic' as resolution
  FROM silver.sales_interactions
  HAVING COUNT(*) > COUNT(DISTINCT canonical_tx_id)
)
SELECT
  issue_type,
  severity,
  affected_records,
  condition_desc,
  resolution,
  CASE
    WHEN affected_records = 0 THEN '✅'
    WHEN severity = 'CRITICAL' THEN '🚨'
    WHEN severity = 'HIGH' THEN '⚠️'
    ELSE 'ℹ️'
  END as status_icon,
  now() as detected_at
FROM issue_detection
WHERE affected_records > 0
ORDER BY
  CASE severity
    WHEN 'CRITICAL' THEN 1
    WHEN 'HIGH' THEN 2
    WHEN 'MEDIUM' THEN 3
    ELSE 4
  END,
  affected_records DESC;

-- 3. ETL Activity Stream View
-- Recent ETL activity and processing status
CREATE OR REPLACE VIEW dq.v_etl_activity_stream AS
WITH recent_activity AS (
  SELECT
    'Data Ingestion' as activity_type,
    source,
    COUNT(*) as record_count,
    MAX(effective_ts) as last_activity,
    'Records processed' as description,
    CASE
      WHEN MAX(effective_ts) > now() - interval '1 hour' THEN 'ACTIVE'
      WHEN MAX(effective_ts) > now() - interval '24 hours' THEN 'RECENT'
      ELSE 'STALE'
    END as status
  FROM silver.sales_interactions
  WHERE effective_ts > now() - interval '7 days'
  GROUP BY source

  UNION ALL

  SELECT
    'Quality Check' as activity_type,
    'System' as source,
    (SELECT COUNT(*) FROM dq.v_data_health_issues WHERE affected_records > 0) as record_count,
    now() as last_activity,
    'Issues detected' as description,
    CASE
      WHEN (SELECT COUNT(*) FROM dq.v_data_health_issues WHERE severity = 'CRITICAL' AND affected_records > 0) > 0 THEN 'CRITICAL'
      WHEN (SELECT COUNT(*) FROM dq.v_data_health_issues WHERE affected_records > 0) > 0 THEN 'WARNING'
      ELSE 'HEALTHY'
    END as status
)
SELECT
  activity_type,
  source,
  record_count,
  last_activity,
  description,
  status,
  CASE status
    WHEN 'ACTIVE' THEN '🟢'
    WHEN 'RECENT' THEN '🟡'
    WHEN 'STALE' THEN '🔴'
    WHEN 'HEALTHY' THEN '✅'
    WHEN 'WARNING' THEN '⚠️'
    WHEN 'CRITICAL' THEN '🚨'
    ELSE 'ℹ️'
  END as status_icon,
  CASE
    WHEN last_activity > now() - interval '1 hour' THEN 'Just now'
    WHEN last_activity > now() - interval '1 day' THEN EXTRACT(HOUR FROM now() - last_activity)::text || 'h ago'
    ELSE EXTRACT(DAY FROM now() - last_activity)::text || 'd ago'
  END as time_ago
FROM recent_activity
ORDER BY last_activity DESC;

-- Grant permissions
GRANT USAGE ON SCHEMA dq TO anon, authenticated, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA dq TO anon, authenticated, service_role;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_sales_interactions_effective_ts ON silver.sales_interactions(effective_ts);
CREATE INDEX IF NOT EXISTS idx_sales_interactions_source ON silver.sales_interactions(source);
CREATE INDEX IF NOT EXISTS idx_sales_interactions_canonical_tx_id ON silver.sales_interactions(canonical_tx_id);

-- Test the views
SELECT 'DQ Health Views Created Successfully' as status,
       (SELECT COUNT(*) FROM dq.v_data_health_summary) as summary_records,
       (SELECT COUNT(*) FROM dq.v_data_health_issues) as issues_detected,
       (SELECT COUNT(*) FROM dq.v_etl_activity_stream) as activity_entries;