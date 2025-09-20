-- Enhanced Data Quality Detection for Production
-- Consolidates PS2 amount validation, duplicate detection, and grading

-- Create enhanced fact view (unified data layer)
CREATE OR REPLACE VIEW dq.f_records AS
SELECT
  interaction_id as record_id,
  source,
  store_id,
  canonical_tx_id as source_txn_id,
  device_id,
  effective_ts as txn_ts,
  amount as header_amount,
  'PHP' as currency,
  created_at as loaded_at,
  raw_data as items_json,
  transaction_ts,
  age,
  gender,
  emotion
FROM silver.sales_interactions;

-- A) PS2 Amount Validation (header vs items array)
CREATE OR REPLACE VIEW dq.v_ps2_amount_check AS
WITH base AS (
  SELECT
    r.record_id,
    r.source,
    r.source_txn_id,
    r.device_id,
    r.txn_ts,
    r.header_amount,
    r.currency,
    r.items_json,
    COALESCE(r.header_amount, 0) as amount_normalized
  FROM dq.f_records r
  WHERE r.source IN ('ps2', 'edge')
),
items_calc AS (
  SELECT
    b.record_id,
    CASE
      WHEN b.items_json IS NOT NULL AND jsonb_typeof(b.items_json->'items') = 'array'
      THEN (
        SELECT SUM(
          COALESCE((item->>'quantity')::numeric, 1) *
          COALESCE((item->>'totalPrice')::numeric, (item->>'unitPrice')::numeric, 0)
        )
        FROM jsonb_array_elements(b.items_json->'items') AS item
      )
      WHEN b.items_json IS NOT NULL AND b.items_json ? 'totals'
      THEN COALESCE((b.items_json->'totals'->>'totalAmount')::numeric, 0)
      ELSE NULL
    END AS items_amount
  FROM base b
)
SELECT
  b.*,
  i.items_amount,
  COALESCE(i.items_amount, 0) - b.amount_normalized AS amount_delta,
  CASE
    WHEN b.amount_normalized = 0 AND i.items_amount IS NOT NULL AND i.items_amount > 0 THEN 'MISSING_HEADER'
    WHEN i.items_amount IS NULL AND b.amount_normalized > 0 THEN 'MISSING_ITEMS'
    WHEN i.items_amount IS NULL AND b.amount_normalized = 0 THEN 'BOTH_MISSING'
    WHEN ABS(COALESCE(i.items_amount, 0) - b.amount_normalized) <= 0.01 THEN 'OK'
    WHEN ABS(COALESCE(i.items_amount, 0) - b.amount_normalized) <= 5 THEN 'MINOR_DRIFT'
    ELSE 'MAJOR_DRIFT'
  END AS amount_status
FROM base b
LEFT JOIN items_calc i USING (record_id);

-- B) Duplicate Detection (cross-source with time window)
CREATE OR REPLACE VIEW dq.v_suspected_duplicates AS
WITH normalized_keys AS (
  SELECT
    record_id,
    source,
    COALESCE(store_id, device_id::text, 'unknown') AS store_key,
    COALESCE(source_txn_id,
             md5(source || COALESCE(device_id::text,'') || COALESCE(txn_ts::text,''))
    ) AS txn_key,
    date_trunc('minute', txn_ts) AS minute_ts,
    txn_ts,
    header_amount
  FROM dq.f_records
  WHERE txn_ts IS NOT NULL
),
duplicate_pairs AS (
  SELECT
    a.record_id AS record_id_a,
    b.record_id AS record_id_b,
    a.source AS source_a,
    b.source AS source_b,
    a.store_key,
    a.txn_key,
    a.minute_ts,
    b.minute_ts AS minute_ts_b,
    a.header_amount AS amount_a,
    b.header_amount AS amount_b,
    EXTRACT(EPOCH FROM (b.txn_ts - a.txn_ts))/60.0 AS minute_gap
  FROM normalized_keys a
  JOIN normalized_keys b
    ON a.record_id < b.record_id  -- Avoid duplicating pairs
   AND a.store_key = b.store_key
   AND ABS(EXTRACT(EPOCH FROM (a.txn_ts - b.txn_ts))) <= 300  -- 5 minute window
   AND (
     -- Same transaction ID pattern
     a.txn_key = b.txn_key
     OR
     -- Similar amounts within 1% and same store/time
     (ABS(COALESCE(a.header_amount,0) - COALESCE(b.header_amount,0)) <= GREATEST(a.header_amount, b.header_amount) * 0.01)
   )
)
SELECT
  record_id_a,
  record_id_b,
  store_key,
  txn_key,
  source_a,
  source_b,
  minute_ts,
  minute_ts_b,
  amount_a,
  amount_b,
  minute_gap,
  CASE
    WHEN ABS(minute_gap) <= 1 AND source_a != source_b THEN 'CROSS_SOURCE_DUPLICATE'
    WHEN ABS(minute_gap) <= 0.1 THEN 'EXACT_TIME_DUPLICATE'
    WHEN txn_key IS NOT NULL THEN 'SAME_TRANSACTION_ID'
    ELSE 'SUSPECTED_DUPLICATE'
  END AS duplicate_type
FROM duplicate_pairs;

-- C) Enhanced Issues View
CREATE OR REPLACE VIEW dq.v_data_health_issues AS
-- Amount Issues
SELECT
  'PS2 Amount Mismatch' as issue_type,
  CASE amount_status
    WHEN 'MAJOR_DRIFT' THEN 'HIGH'
    WHEN 'MINOR_DRIFT' THEN 'MEDIUM'
    WHEN 'MISSING_HEADER' THEN 'MEDIUM'
    WHEN 'MISSING_ITEMS' THEN 'LOW'
    WHEN 'BOTH_MISSING' THEN 'HIGH'
  END AS severity,
  COUNT(*)::int as affected_records,
  'Header amount ≠ items array sum' as condition_desc,
  'Map PS2 items[].totalPrice to amount field' as resolution,
  CASE
    WHEN COUNT(*) = 0 THEN '✅'
    WHEN MAX(CASE amount_status WHEN 'MAJOR_DRIFT' THEN 1 ELSE 0 END) = 1 THEN '🚨'
    ELSE 'ℹ️'
  END as status_icon,
  now() as detected_at,
  jsonb_build_object(
    'major_drift', SUM(CASE WHEN amount_status = 'MAJOR_DRIFT' THEN 1 ELSE 0 END),
    'minor_drift', SUM(CASE WHEN amount_status = 'MINOR_DRIFT' THEN 1 ELSE 0 END),
    'missing_header', SUM(CASE WHEN amount_status = 'MISSING_HEADER' THEN 1 ELSE 0 END),
    'sample_delta', AVG(ABS(amount_delta))
  ) as details
FROM dq.v_ps2_amount_check
WHERE amount_status != 'OK'
GROUP BY amount_status
HAVING COUNT(*) > 0

UNION ALL

-- Duplicate Issues
SELECT
  'Potential Duplicates' as issue_type,
  CASE duplicate_type
    WHEN 'CROSS_SOURCE_DUPLICATE' THEN 'HIGH'
    WHEN 'EXACT_TIME_DUPLICATE' THEN 'CRITICAL'
    ELSE 'MEDIUM'
  END AS severity,
  COUNT(*)::int as affected_records,
  'Duplicate transactions across sources' as condition_desc,
  'Review canonical ID generation and deduplication logic' as resolution,
  CASE
    WHEN COUNT(*) = 0 THEN '✅'
    WHEN MAX(CASE duplicate_type WHEN 'EXACT_TIME_DUPLICATE' THEN 1 ELSE 0 END) = 1 THEN '🚨'
    ELSE '⚠️'
  END as status_icon,
  now() as detected_at,
  jsonb_build_object(
    'cross_source', SUM(CASE WHEN duplicate_type = 'CROSS_SOURCE_DUPLICATE' THEN 1 ELSE 0 END),
    'exact_time', SUM(CASE WHEN duplicate_type = 'EXACT_TIME_DUPLICATE' THEN 1 ELSE 0 END),
    'suspected', SUM(CASE WHEN duplicate_type = 'SUSPECTED_DUPLICATE' THEN 1 ELSE 0 END),
    'avg_time_gap', AVG(ABS(minute_gap))
  ) as details
FROM dq.v_suspected_duplicates
GROUP BY duplicate_type
HAVING COUNT(*) > 0

UNION ALL

-- Timestamp Issues
SELECT
  'Missing Timestamps' as issue_type,
  'CRITICAL' as severity,
  COUNT(*)::int as affected_records,
  'effective_ts IS NULL' as condition_desc,
  'PS2/Edge timestamp fallback needed' as resolution,
  CASE WHEN COUNT(*) = 0 THEN '✅' ELSE '🚨' END as status_icon,
  now() as detected_at,
  jsonb_build_object('null_count', COUNT(*)) as details
FROM dq.f_records
WHERE txn_ts IS NULL
HAVING COUNT(*) > 0

UNION ALL

-- Store ID Issues
SELECT
  'Missing Store IDs' as issue_type,
  'HIGH' as severity,
  COUNT(*)::int as affected_records,
  'store_id IS NULL' as condition_desc,
  'Device-to-store mapping required' as resolution,
  CASE WHEN COUNT(*) = 0 THEN '✅' ELSE '⚠️' END as status_icon,
  now() as detected_at,
  jsonb_build_object('null_count', COUNT(*)) as details
FROM dq.f_records
WHERE store_id IS NULL
HAVING COUNT(*) > 0;

-- D) Enhanced Summary with Grading
CREATE OR REPLACE VIEW dq.v_data_health_summary AS
WITH base_stats AS (
  SELECT
    COUNT(*) as total_records,
    COUNT(CASE WHEN source = 'azure' THEN 1 END) as azure_records,
    COUNT(CASE WHEN source = 'ps2' THEN 1 END) as ps2_records,
    COUNT(CASE WHEN source = 'edge' THEN 1 END) as edge_records,
    COUNT(DISTINCT source_txn_id) as unique_transactions,
    COUNT(*) - COUNT(DISTINCT source_txn_id) as potential_duplicates,
    AVG(CASE WHEN txn_ts IS NOT NULL THEN 1.0 ELSE 0.0 END) * 100 as timestamp_quality,
    AVG(CASE WHEN store_id IS NOT NULL THEN 1.0 ELSE 0.0 END) * 100 as store_quality,
    AVG(CASE WHEN header_amount IS NOT NULL AND header_amount > 0 THEN 1.0 ELSE 0.0 END) * 100 as amount_quality,
    COUNT(DISTINCT source_txn_id) * 100.0 / COUNT(*) as uniqueness_ratio,
    MAX(txn_ts) as latest_transaction,
    MIN(txn_ts) as earliest_transaction
  FROM dq.f_records
  WHERE txn_ts IS NOT NULL
),
quality_issues AS (
  SELECT
    SUM(CASE WHEN severity = 'CRITICAL' THEN affected_records ELSE 0 END) as critical_issues,
    SUM(CASE WHEN severity = 'HIGH' THEN affected_records ELSE 0 END) as high_issues,
    SUM(CASE WHEN severity = 'MEDIUM' THEN affected_records ELSE 0 END) as medium_issues,
    SUM(CASE WHEN issue_type LIKE '%Amount%' AND severity IN ('HIGH','MEDIUM') THEN affected_records ELSE 0 END) as amount_issues,
    SUM(CASE WHEN issue_type LIKE '%Duplicate%' THEN affected_records ELSE 0 END) as duplicate_issues
  FROM dq.v_data_health_issues
)
SELECT
  s.*,
  EXTRACT(DAYS FROM (s.latest_transaction - s.earliest_transaction)) as data_span_days,
  q.critical_issues,
  q.high_issues,
  q.medium_issues,
  q.amount_issues,
  q.duplicate_issues,
  CASE
    WHEN s.timestamp_quality = 100 AND s.store_quality = 100
         AND q.critical_issues = 0 AND q.amount_issues = 0 THEN 'EXCELLENT'
    WHEN s.timestamp_quality >= 99.5 AND s.store_quality >= 99.5
         AND q.critical_issues = 0 THEN 'GOOD'
    WHEN s.timestamp_quality >= 95 AND s.store_quality >= 95
         AND q.critical_issues <= 10 THEN 'FAIR'
    ELSE 'POOR'
  END as overall_grade,
  now() as calculated_at
FROM base_stats s
CROSS JOIN quality_issues q;

-- E) Enhanced Activity Stream
CREATE OR REPLACE VIEW dq.v_etl_activity_stream AS
WITH recent_loads AS (
  SELECT
    'Data Ingestion' as activity_type,
    source,
    COUNT(*) as record_count,
    MAX(loaded_at) as last_activity,
    'Records processed from ' || source as description,
    CASE
      WHEN MAX(loaded_at) > now() - interval '1 hour' THEN 'ACTIVE'
      WHEN MAX(loaded_at) > now() - interval '4 hours' THEN 'RECENT'
      WHEN MAX(loaded_at) > now() - interval '24 hours' THEN 'STALE'
      ELSE 'OFFLINE'
    END as status
  FROM dq.f_records
  WHERE loaded_at > now() - interval '7 days'
  GROUP BY source

  UNION ALL

  SELECT
    'Quality Assessment' as activity_type,
    'System' as source,
    (SELECT COUNT(*) FROM dq.v_data_health_issues WHERE affected_records > 0) as record_count,
    now() as last_activity,
    'DQ issues detected and classified' as description,
    CASE
      WHEN (SELECT COUNT(*) FROM dq.v_data_health_issues WHERE severity = 'CRITICAL' AND affected_records > 0) > 0 THEN 'CRITICAL'
      WHEN (SELECT COUNT(*) FROM dq.v_data_health_issues WHERE severity = 'HIGH' AND affected_records > 0) > 0 THEN 'WARNING'
      WHEN (SELECT COUNT(*) FROM dq.v_data_health_issues WHERE affected_records > 0) > 0 THEN 'INFO'
      ELSE 'HEALTHY'
    END as status

  UNION ALL

  SELECT
    'Deduplication' as activity_type,
    'System' as source,
    (SELECT COUNT(*) FROM dq.v_suspected_duplicates) as record_count,
    now() as last_activity,
    'Duplicate detection analysis' as description,
    CASE
      WHEN (SELECT COUNT(*) FROM dq.v_suspected_duplicates WHERE duplicate_type = 'EXACT_TIME_DUPLICATE') > 0 THEN 'CRITICAL'
      WHEN (SELECT COUNT(*) FROM dq.v_suspected_duplicates WHERE duplicate_type = 'CROSS_SOURCE_DUPLICATE') > 10 THEN 'WARNING'
      WHEN (SELECT COUNT(*) FROM dq.v_suspected_duplicates) > 0 THEN 'INFO'
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
    WHEN 'STALE' THEN '🟠'
    WHEN 'OFFLINE' THEN '🔴'
    WHEN 'HEALTHY' THEN '✅'
    WHEN 'INFO' THEN 'ℹ️'
    WHEN 'WARNING' THEN '⚠️'
    WHEN 'CRITICAL' THEN '🚨'
    ELSE 'ℹ️'
  END as status_icon,
  CASE
    WHEN last_activity > now() - interval '1 hour' THEN
      EXTRACT(MINUTES FROM now() - last_activity)::text || 'min ago'
    WHEN last_activity > now() - interval '1 day' THEN
      EXTRACT(HOURS FROM now() - last_activity)::text || 'h ago'
    WHEN last_activity > now() - interval '7 days' THEN
      EXTRACT(DAYS FROM now() - last_activity)::text || 'd ago'
    ELSE 'Over 1 week ago'
  END as time_ago
FROM recent_loads
ORDER BY
  CASE status
    WHEN 'CRITICAL' THEN 1
    WHEN 'WARNING' THEN 2
    WHEN 'INFO' THEN 3
    WHEN 'ACTIVE' THEN 4
    WHEN 'RECENT' THEN 5
    ELSE 6
  END,
  last_activity DESC;

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_dq_records_source_loaded ON silver.sales_interactions(source, created_at);
CREATE INDEX IF NOT EXISTS idx_dq_records_store_device ON silver.sales_interactions(store_id, device_id);
CREATE INDEX IF NOT EXISTS idx_dq_records_canonical ON silver.sales_interactions(canonical_tx_id);

-- Grant permissions
GRANT SELECT ON dq.f_records TO anon, authenticated, service_role;
GRANT SELECT ON dq.v_ps2_amount_check TO anon, authenticated, service_role;
GRANT SELECT ON dq.v_suspected_duplicates TO anon, authenticated, service_role;

-- Test enhanced detection
SELECT 'Enhanced DQ Detection Deployed' as status,
       (SELECT overall_grade FROM dq.v_data_health_summary) as grade,
       (SELECT COUNT(*) FROM dq.v_data_health_issues) as issues_detected,
       (SELECT COUNT(*) FROM dq.v_ps2_amount_check WHERE amount_status != 'OK') as amount_issues,
       (SELECT COUNT(*) FROM dq.v_suspected_duplicates) as potential_duplicates;