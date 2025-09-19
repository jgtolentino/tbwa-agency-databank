-- PS2 Timestamp Fallback + Effective TS
-- Fixes empty PS2 timestamps using deterministic fallback hierarchy
-- Rule: effective_ts = COALESCE(NULLIF(timestamp,'')::timestamptz, privacy.consentTimestamp::timestamptz, _ingested_at, _ingested_at - interval '1 second')

create schema if not exists silver;

-- Add cols if missing
alter table if exists silver.ps2_transactions
  add column if not exists raw_ts_text text,
  add column if not exists consent_ts timestamptz,
  add column if not exists effective_ts timestamptz;

-- Recompute from bronze (safe re-upsert path)
with src as (
  select
    b.json->>'transactionId'                           as transaction_id,
    b.json->>'timestamp'                               as raw_ts_text,
    (b.json#>>'{privacy,consentTimestamp}')::timestamptz as consent_ts,
    b.ingested_at                                      as _ingested_at
  from bronze.ps2_payloads b
)
update silver.ps2_transactions t
set raw_ts_text = s.raw_ts_text,
    consent_ts  = s.consent_ts,
    effective_ts = coalesce(
      nullif(s.raw_ts_text,'')::timestamptz,
      s.consent_ts,
      t.loaded_at,
      t.event_ts,
      s._ingested_at
    )
from src s
where s.transaction_id = t.transaction_id;

-- Guard: never allow future effective_ts due to bad clocks
update silver.ps2_transactions
set effective_ts = least(effective_ts, now());

-- Quick index for joins
create index if not exists idx_ps2_tx_effective_ts on silver.ps2_transactions(effective_ts);