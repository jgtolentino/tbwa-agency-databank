-- PS2 Items Array Flattening + Proper Price Mapping
-- Re-runs bronze → silver explode to properly flatten items[] and map prices
-- Ensures basket_size and total_amount are set from PS2 totals while item rows carry unitPrice/totalPrice

-- Upsert transactions core fields (including totals)
insert into silver.ps2_transactions as t(
  transaction_id, device_id, store_id, event_ts, loaded_at,
  total_amount, total_items, time_of_day, payment_method, duration_seconds, raw
)
select
  b.json->>'transactionId',
  b.json->>'deviceId',
  b.json->>'storeId',
  nullif(b.json->>'timestamp','')::timestamptz,
  b.ingested_at,
  (b.json#>>'{totals,totalAmount}')::numeric,
  (b.json#>>'{totals,totalItems}')::int,
  b.json#>>'{transactionContext,timeOfDay}',
  b.json#>>'{transactionContext,paymentMethod}',
  (b.json#>>'{transactionContext,duration}')::int,
  b.json
from bronze.ps2_payloads b
on conflict (transaction_id) do update
set device_id = excluded.device_id,
    store_id  = excluded.store_id,
    event_ts  = excluded.event_ts,
    loaded_at = excluded.loaded_at,
    total_amount = coalesce(excluded.total_amount, t.total_amount),
    total_items  = coalesce(excluded.total_items,  t.total_items),
    time_of_day  = coalesce(excluded.time_of_day,  t.time_of_day),
    payment_method = coalesce(excluded.payment_method, t.payment_method),
    duration_seconds = coalesce(excluded.duration_seconds, t.duration_seconds),
    raw = excluded.raw;

-- Create ps2_items table if it doesn't exist
create table if not exists silver.ps2_items (
  transaction_id text not null,
  idx int not null,
  brand_name text,
  product_name text,
  sku text,
  quantity numeric,
  unit_price numeric,
  total_price numeric,
  category text,
  is_unbranded boolean,
  confidence numeric,
  primary key (transaction_id, idx)
);

-- Explode items[]
with j as (
  select b.json->>'transactionId' as transaction_id, b.json->'items' as items
  from bronze.ps2_payloads b
  where b.json ? 'items'
),
expl as (
  select transaction_id, itm, ord::int as idx
  from j, jsonb_array_elements(j.items) with ordinality as t(itm, ord)
)
insert into silver.ps2_items as i(
  transaction_id, idx, brand_name, product_name, sku,
  quantity, unit_price, total_price, category, is_unbranded, confidence
)
select
  transaction_id, idx,
  itm->>'brandName',
  itm->>'productName',
  itm->>'sku',
  (itm->>'quantity')::numeric,
  (itm->>'unitPrice')::numeric,
  (itm->>'totalPrice')::numeric,
  itm->>'category',
  (itm->>'isUnbranded')::boolean,
  (itm->>'confidence')::numeric
from expl
on conflict (transaction_id, idx) do update
set brand_name = excluded.brand_name,
    product_name = excluded.product_name,
    sku = excluded.sku,
    quantity = excluded.quantity,
    unit_price = excluded.unit_price,
    total_price = excluded.total_price,
    category = excluded.category,
    is_unbranded = excluded.is_unbranded,
    confidence = excluded.confidence;

-- Derived: basket_size default from items length if totals missing
update silver.ps2_transactions t
set total_items = i.cnt
from (
  select transaction_id, count(*) cnt
  from silver.ps2_items
  group by 1
) i
where t.transaction_id = i.transaction_id
  and (t.total_items is null or t.total_items = 0);