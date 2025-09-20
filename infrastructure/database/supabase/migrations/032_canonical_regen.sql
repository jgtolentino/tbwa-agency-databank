-- Regenerate canonical_tx_id WITH effective_ts
-- Computes canonical using (store_id, effective_ts (second precision), total_amount, coalesce(device_id, facial_id))
-- This avoids collapsing transactions even when PS2's original timestamp was empty

create schema if not exists governance;

-- Canonical function (UUID from md5)
create or replace function governance.canonical_tx_id(
  p_store text, p_ts timestamptz, p_amt numeric, p_dev text
) returns uuid language sql immutable as $
  select (regexp_replace(
    md5(coalesce(p_store,'') || '|' ||
        to_char(date_trunc('second', p_ts),'YYYY-MM-DD"T"HH24:MI:SS') || '|' ||
        coalesce(to_char(round(coalesce(p_amt,0),2),'FM999999990D00'),'0.00') || '|' ||
        coalesce(p_dev,'')),
    '(.{8})(.{4})(.{4})(.{4})(.{12})',
    '\1-\2-\3-\4-\5'
  ))::uuid
$;

-- Add canonical col if missing on silver staging
alter table if exists silver.ps2_transactions
  add column if not exists canonical_tx_id uuid;

-- Recompute canonical for PS2
update silver.ps2_transactions t
set canonical_tx_id = governance.canonical_tx_id(
  t.store_id,
  t.effective_ts,
  coalesce(t.total_amount,0),
  t.device_id
);

-- Add canonical col to existing sales_interactions if exists
alter table if exists silver.sales_interactions
  add column if not exists canonical_tx_id uuid;

-- Update existing sales_interactions with new canonical logic
update silver.sales_interactions t
set canonical_tx_id = governance.canonical_tx_id(
  t.store_id,
  t.effective_ts,
  coalesce(t.amount,0),
  coalesce(t.facial_id, t.device_id)
)
where t.canonical_tx_id is null or t.effective_ts is not null;