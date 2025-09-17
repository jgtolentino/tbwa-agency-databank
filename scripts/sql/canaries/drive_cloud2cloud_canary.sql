-- Google Drive Cloud-to-Cloud Sync Canary Test
-- Verifies Drive integration is receiving and processing files

-- Check if Drive intelligence tables exist and have recent data
SELECT
    'drive_bronze_files' as table_name,
    COUNT(*) as row_count,
    MAX(created_at) as last_sync,
    COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '1 hour') as recent_files,
    CASE
        WHEN COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '1 hour') > 0
        THEN 'ACTIVE_SYNC'
        ELSE 'STALE_DATA'
    END as sync_status
FROM drive_intelligence.bronze_files
WHERE file_type IN ('csv', 'xlsx', 'json')

UNION ALL

SELECT
    'drive_processed_data' as table_name,
    COUNT(*) as row_count,
    MAX(processed_at) as last_sync,
    COUNT(*) FILTER (WHERE processed_at >= NOW() - INTERVAL '1 hour') as recent_files,
    CASE
        WHEN COUNT(*) FILTER (WHERE processed_at >= NOW() - INTERVAL '1 hour') > 0
        THEN 'ACTIVE_PROCESSING'
        ELSE 'STALE_PROCESSING'
    END as sync_status
FROM drive_intelligence.processed_data

UNION ALL

-- Fallback: Check edge function logs for Drive activity
SELECT
    'edge_function_logs' as table_name,
    COUNT(*) as row_count,
    MAX(created_at) as last_sync,
    COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '1 hour') as recent_files,
    CASE
        WHEN COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '1 hour') > 0
        THEN 'EDGE_FUNCTION_ACTIVE'
        ELSE 'EDGE_FUNCTION_INACTIVE'
    END as sync_status
FROM edge_logs.function_invocations
WHERE function_name ILIKE '%drive%';