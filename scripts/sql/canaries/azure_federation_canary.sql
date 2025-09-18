-- Azure SQL Federation Canary Test
-- Verifies Azure integration is streaming events via MindsDB

-- Check if Azure staging tables have recent data
SELECT
    'azure_stream_events' as table_name,
    COUNT(*) as row_count,
    MAX(event_timestamp) as last_event,
    COUNT(*) FILTER (WHERE event_timestamp >= NOW() - INTERVAL '1 hour') as recent_events,
    CASE
        WHEN COUNT(*) FILTER (WHERE event_timestamp >= NOW() - INTERVAL '1 hour') > 0
        THEN 'STREAMING_ACTIVE'
        ELSE 'STREAM_STALE'
    END as stream_status
FROM azure_ingest.stream_events
WHERE event_type IN ('transaction', 'customer_activity', 'product_event')

UNION ALL

SELECT
    'azure_federation_bridge' as table_name,
    COUNT(*) as row_count,
    MAX(sync_timestamp) as last_event,
    COUNT(*) FILTER (WHERE sync_timestamp >= NOW() - INTERVAL '1 hour') as recent_events,
    CASE
        WHEN COUNT(*) FILTER (WHERE sync_timestamp >= NOW() - INTERVAL '1 hour') > 0
        THEN 'FEDERATION_ACTIVE'
        ELSE 'FEDERATION_STALE'
    END as stream_status
FROM azure_federation.bridge_status

UNION ALL

-- Check MindsDB connection health
SELECT
    'mindsdb_connection' as table_name,
    CASE
        WHEN EXISTS (
            SELECT 1 FROM information_schema.foreign_servers
            WHERE server_name ILIKE '%mindsdb%'
        ) THEN 1 ELSE 0
    END as row_count,
    NOW() as last_event,
    CASE
        WHEN EXISTS (
            SELECT 1 FROM information_schema.foreign_servers
            WHERE server_name ILIKE '%mindsdb%'
        ) THEN 1 ELSE 0
    END as recent_events,
    CASE
        WHEN EXISTS (
            SELECT 1 FROM information_schema.foreign_servers
            WHERE server_name ILIKE '%mindsdb%'
        )
        THEN 'MINDSDB_CONNECTED'
        ELSE 'MINDSDB_DISCONNECTED'
    END as stream_status;