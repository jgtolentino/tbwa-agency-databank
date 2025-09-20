-- PS2 ETL Verification Queries
-- Run these to prove the fixes work correctly

-- 1. Timestamp coverage after fallback
select
  'PS2 Timestamp Coverage' as test_name,
  count(*) as ps2_rows,
  sum((raw_ts_text is not null and raw_ts_text <> '')::int) as with_raw_ts,
  sum((consent_ts is not null)::int) as with_consent_ts,
  sum((effective_ts is not null)::int) as with_effective_ts,
  round(100.0*avg((effective_ts is not null)::int),2) as pct_effective_ok
from silver.ps2_transactions;

-- 2. Items flattened properly
select
  'PS2 Items Flattening' as test_name,
  (select count(*) from silver.ps2_transactions) as tx_rows,
  (select count(*) from silver.ps2_items)        as item_rows,
  (select round(1.0 * count(*) / nullif(sum(total_items),0),2)
     from silver.ps2_transactions)               as avg_items_per_tx_reported;

-- 3. Pricing mapped correctly
select
  'PS2 Pricing Mapping' as test_name,
  round(100.0*avg((total_amount is not null)::int),2) as pct_total_amount,
  round(100.0*avg((total_items is not null)::int),2)  as pct_basket_size,
  round(avg(total_amount), 2) as avg_transaction_value
from silver.ps2_transactions;

-- 4. Canonical uniqueness (no collapses)
select
  'Canonical TX ID Uniqueness' as test_name,
  count(*) as gold_rows,
  count(distinct canonical_tx_id) as uniq_canon,
  count(*) - count(distinct canonical_tx_id) as potential_collapses,
  case
    when count(*) = count(distinct canonical_tx_id) then '✅ PASS'
    else '❌ FAIL'
  end as status
from gold.v_transactions_flat;

-- 5. PS2 vs Azure data quality comparison
select
  'Data Quality by Source' as test_name,
  source,
  count(*) as records,
  round(100.0 * avg((transaction_ts is not null)::int), 2) as pct_with_timestamp,
  round(100.0 * avg((total_amount is not null and total_amount > 0)::int), 2) as pct_with_amount,
  round(100.0 * avg((store_id is not null)::int), 2) as pct_with_store,
  round(avg(total_amount), 2) as avg_amount
from gold.v_transactions_flat
group by source
order by source;

-- 6. Temporal distribution check
select
  'PS2 Temporal Distribution' as test_name,
  date_trunc('hour', transaction_ts) as hour_bucket,
  count(*) as transactions,
  round(avg(total_amount), 2) as avg_amount
from gold.v_transactions_flat
where source = 'ps2'
  and transaction_ts is not null
group by 1, 2
order by 2 desc
limit 24;

-- 7. Brand detection validation
select
  'PS2 Brand Detection' as test_name,
  unnest(brands_all) as brand,
  count(*) as mentions,
  round(avg(total_amount), 2) as avg_transaction_value
from gold.v_transactions_flat
where source = 'ps2'
  and array_length(brands_all, 1) > 0
group by brand
order by mentions desc
limit 10;

-- 8. Store coverage validation
select
  'Store Coverage by Source' as test_name,
  source,
  count(distinct store_id) as unique_stores,
  count(*) as total_transactions,
  round(count(*) * 1.0 / count(distinct store_id), 1) as avg_transactions_per_store
from gold.v_transactions_flat
where store_id is not null
group by source;

-- 9. Data completeness scorecard
with completeness as (
  select
    source,
    count(*) as total_records,
    sum((transaction_ts is not null)::int) as with_timestamp,
    sum((total_amount is not null and total_amount > 0)::int) as with_amount,
    sum((store_id is not null)::int) as with_store,
    sum((canonical_tx_id is not null)::int) as with_canonical
  from gold.v_transactions_flat
  group by source
)
select
  'Data Completeness Scorecard' as test_name,
  source,
  total_records,
  round(100.0 * with_timestamp / total_records, 1) as timestamp_pct,
  round(100.0 * with_amount / total_records, 1) as amount_pct,
  round(100.0 * with_store / total_records, 1) as store_pct,
  round(100.0 * with_canonical / total_records, 1) as canonical_pct,
  case
    when with_timestamp = total_records
     and with_amount = total_records
     and with_store = total_records
     and with_canonical = total_records
    then '✅ PERFECT'
    when with_timestamp * 1.0 / total_records >= 0.95
     and with_amount * 1.0 / total_records >= 0.90
     and with_store * 1.0 / total_records >= 0.95
     and with_canonical * 1.0 / total_records >= 0.99
    then '✅ GOOD'
    else '⚠️ NEEDS_REVIEW'
  end as quality_grade
from completeness
order by source;