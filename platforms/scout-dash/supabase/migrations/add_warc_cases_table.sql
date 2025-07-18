-- Add WARC cases table to creative_ops schema
-- This stores effectiveness case studies from WARC Effective 100

CREATE TABLE IF NOT EXISTS creative_ops.warc_cases (
    case_id VARCHAR(255) PRIMARY KEY,
    
    -- Campaign identification
    campaign_name TEXT,
    brand TEXT,
    parent_company TEXT,
    publication_year INTEGER,
    warc_source TEXT,
    industry_sector TEXT,
    sub_category TEXT,
    
    -- Market context
    primary_market TEXT,
    market_type TEXT,
    target_audience TEXT,
    
    -- Business context
    primary_challenge TEXT,
    market_situation TEXT,
    competitive_context TEXT,
    primary_objective TEXT,
    
    -- Campaign strategy
    strategic_approach TEXT,
    key_insight TEXT,
    creative_concept TEXT,
    
    -- Execution details
    media_mix TEXT[],
    channel_strategy TEXT,
    budget_allocation JSONB,
    
    -- Performance metrics
    effectiveness_metrics JSONB,
    business_results JSONB,
    performance_lift JSONB,
    
    -- Cultural and social elements
    cultural_relevance TEXT,
    social_impact TEXT,
    
    -- Awards and recognition
    awards_won TEXT[],
    recognition_details JSONB,
    
    -- Technical integration
    technology_used TEXT[],
    innovation_elements TEXT,
    
    -- Full case data (for complex nested structures)
    full_case_data JSONB,
    
    -- Metadata
    warc_file_id TEXT,
    extraction_date DATE,
    data_quality_score FLOAT,
    
    -- Tracking
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_warc_cases_brand ON creative_ops.warc_cases(brand);
CREATE INDEX IF NOT EXISTS idx_warc_cases_year ON creative_ops.warc_cases(publication_year);
CREATE INDEX IF NOT EXISTS idx_warc_cases_industry ON creative_ops.warc_cases(industry_sector);
CREATE INDEX IF NOT EXISTS idx_warc_cases_market ON creative_ops.warc_cases(primary_market);
CREATE INDEX IF NOT EXISTS idx_warc_cases_source ON creative_ops.warc_cases(warc_source);

-- GIN index for JSONB fields
CREATE INDEX IF NOT EXISTS idx_warc_cases_effectiveness_gin ON creative_ops.warc_cases USING gin(effectiveness_metrics);
CREATE INDEX IF NOT EXISTS idx_warc_cases_results_gin ON creative_ops.warc_cases USING gin(business_results);
CREATE INDEX IF NOT EXISTS idx_warc_cases_full_data_gin ON creative_ops.warc_cases USING gin(full_case_data);

-- Full-text search on key text fields
CREATE INDEX IF NOT EXISTS idx_warc_cases_fulltext ON creative_ops.warc_cases 
USING gin(to_tsvector('english', coalesce(campaign_name, '') || ' ' || 
                                coalesce(brand, '') || ' ' || 
                                coalesce(primary_challenge, '') || ' ' || 
                                coalesce(strategic_approach, '')));

-- Add updated_at trigger
CREATE TRIGGER update_warc_cases_updated_at
BEFORE UPDATE ON creative_ops.warc_cases
FOR EACH ROW
EXECUTE FUNCTION creative_ops.update_updated_at();

-- WARC effectiveness search function
CREATE OR REPLACE FUNCTION creative_ops.search_warc_effectiveness(
    search_query TEXT,
    limit_count INT DEFAULT 10,
    min_year INT DEFAULT 2021
)
RETURNS TABLE (
    case_id VARCHAR(255),
    campaign_name TEXT,
    brand TEXT,
    publication_year INTEGER,
    effectiveness_score FLOAT,
    key_metrics JSONB,
    search_rank FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        w.case_id,
        w.campaign_name,
        w.brand,
        w.publication_year,
        COALESCE((w.effectiveness_metrics->>'overall_score')::float, 0) as effectiveness_score,
        w.effectiveness_metrics as key_metrics,
        ts_rank(
            to_tsvector('english', coalesce(w.campaign_name, '') || ' ' || 
                                  coalesce(w.brand, '') || ' ' || 
                                  coalesce(w.primary_challenge, '') || ' ' || 
                                  coalesce(w.strategic_approach, '')),
            plainto_tsquery('english', search_query)
        ) as search_rank
    FROM creative_ops.warc_cases w
    WHERE w.publication_year >= min_year
    AND (
        search_query = '' OR
        to_tsvector('english', coalesce(w.campaign_name, '') || ' ' || 
                              coalesce(w.brand, '') || ' ' || 
                              coalesce(w.primary_challenge, '') || ' ' || 
                              coalesce(w.strategic_approach, ''))
        @@ plainto_tsquery('english', search_query)
    )
    ORDER BY search_rank DESC, effectiveness_score DESC
    LIMIT limit_count;
END;
$$;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON creative_ops.warc_cases TO authenticated;
GRANT SELECT ON creative_ops.warc_cases TO anon;
GRANT EXECUTE ON FUNCTION creative_ops.search_warc_effectiveness TO anon, authenticated;

-- Add comment
COMMENT ON TABLE creative_ops.warc_cases IS 'WARC Effective 100 case studies for campaign effectiveness analysis';
COMMENT ON FUNCTION creative_ops.search_warc_effectiveness IS 'Full-text search across WARC effectiveness case studies';