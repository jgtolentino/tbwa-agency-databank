-- Wire Gold + Public API to use effective_ts (no UI changes)
-- Recreate/refresh gold.v_transactions_flat to use effective_ts for PS2
-- Ensure public view exposes UI's stable columns

create schema if not exists gold;

-- Recreate/refresh gold.v_transactions_flat to use effective_ts for PS2
create or replace view gold.v_transactions_flat as
with ps2 as (
  select
    'ps2'::text as source,
    t.transaction_id,
    t.store_id,
    t.device_id,
    t.effective_ts as transaction_ts,
    t.total_amount,
    t.total_items as basket_size,
    t.payment_method,
    t.duration_seconds,
    array_remove(array_agg(distinct i.brand_name), null) as item_brands,
    t.canonical_tx_id
  from silver.ps2_transactions t
  left join silver.ps2_items i on i.transaction_id = t.transaction_id
  group by 1,2,3,4,5,6,7,8,9,10
),
azure as (
  select
    'azure'::text as source,
    a.interaction_id::text as transaction_id,
    a.store_id,
    a.facial_id as device_id,
    a.effective_ts as transaction_ts,
    a.amount as total_amount,
    a.qty as basket_size,
    null::text as payment_method,
    null::int as duration_seconds,
    case when a.product_id is not null then array[a.product_id] else array[]::text[] end as item_brands,
    a.canonical_tx_id
  from silver.sales_interactions a
  where a.source = 'azure'
)
select
  p.source,
  p.transaction_id,
  p.store_id,
  p.device_id,
  p.transaction_ts,
  p.total_amount,
  p.basket_size,
  p.payment_method,
  p.duration_seconds,
  p.item_brands as brands_all,
  coalesce(p.canonical_tx_id, governance.canonical_tx_id(p.store_id, p.transaction_ts, coalesce(p.total_amount,0), p.device_id)) as canonical_tx_id
from ps2 p
union all
select
  a.source,
  a.transaction_id,
  a.store_id,
  a.device_id,
  a.transaction_ts,
  a.total_amount,
  a.basket_size,
  a.payment_method,
  a.duration_seconds,
  a.item_brands as brands_all,
  coalesce(a.canonical_tx_id, governance.canonical_tx_id(a.store_id, a.transaction_ts, coalesce(a.total_amount,0), a.device_id)) as canonical_tx_id
from azure a;

-- Grant permissions
grant select on gold.v_transactions_flat to anon, authenticated, service_role;

-- Public shim the UI already uses
create or replace view public.scout_gold_transactions_flat as
select
  g.brands_all[1]                     as brand,
  coalesce(g.store_id::text, 'Unknown') as store,
  g.store_id                          as storeid,
  g.device_id                         as deviceid,
  null::text                          as device,      -- optional: fill if you have device_name
  g.total_amount                      as total_price,
  g.transaction_ts                    as transactiondate,
  (g.transaction_ts at time zone 'Asia/Manila') as ts_ph,
  (g.transaction_ts at time zone 'Asia/Manila')::date as date_ph,
  g.canonical_tx_id,
  g.transaction_id,
  g.source
from gold.v_transactions_flat g;

grant select on public.scout_gold_transactions_flat to anon, authenticated, service_role;

-- Stats summary view
create or replace view public.scout_stats_summary as
select
  count(*) as total_records,
  count(case when source = 'azure' then 1 end) as azure_records,
  count(case when source = 'ps2' then 1 end) as ps2_records,
  count(case when transaction_ts is not null then 1 end) as records_with_timestamp,
  count(case when total_amount is not null and total_amount > 0 then 1 end) as records_with_revenue,
  coalesce(sum(total_amount), 0) as total_revenue,
  max(transaction_ts) as latest_transaction,
  min(transaction_ts) as earliest_transaction,
  count(distinct canonical_tx_id) as unique_transactions,
  count(distinct store_id) as unique_stores
from gold.v_transactions_flat;

grant select on public.scout_stats_summary to anon, authenticated, service_role;