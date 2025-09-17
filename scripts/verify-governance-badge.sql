-- Governance-based Data Source Badge Verification
-- Must return untrusted = 0 for "Trusted" badge display

SELECT
    COUNT(*) FILTER (WHERE dataset_class='trusted') AS trusted,
    COUNT(*) FILTER (WHERE dataset_class<>'trusted') AS untrusted,
    CASE
        WHEN COUNT(*) FILTER (WHERE dataset_class<>'trusted') = 0
        THEN 'BADGE_TRUSTED'
        ELSE 'BADGE_MIXED'
    END as badge_status,
    array_agg(dataset_name ORDER BY dataset_class, dataset_name) as all_datasets,
    array_agg(dataset_class ORDER BY dataset_class, dataset_name) as dataset_classes
FROM public.data_catalog
WHERE dataset_name IN (
    'scout.fact_transactions',
    'scout.master_brands',
    'scout.master_stores',
    'gold.daily_brand_performance',
    'silver.transactions_cleaned',
    'gold_customer_activity',
    'gold_product_combinations',
    'gold_persona_region_metrics',
    'platinum_recommendations',
    'platinum_basket_combos',
    'platinum_persona_insights'
);