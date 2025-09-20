-- Scout Dashboard Schema with Role-Based Access Control
-- Author: TBWA Enterprise Platform
-- Date: 2025-07-18

-- Create user roles enum
CREATE TYPE user_role AS ENUM ('executive', 'regional_manager', 'analyst', 'store_owner');

-- Create department enum
CREATE TYPE department_type AS ENUM ('executive', 'sales', 'operations', 'analytics', 'retail');

-- User profiles with roles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role user_role NOT NULL DEFAULT 'analyst',
  department department_type,
  region TEXT,
  store_id TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Dashboard configurations per role
CREATE TABLE dashboard_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role user_role NOT NULL,
  config JSONB NOT NULL,
  widgets JSONB NOT NULL,
  layout JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(role)
);

-- User dashboard customizations
CREATE TABLE user_dashboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  custom_widgets JSONB DEFAULT '[]',
  custom_layout JSONB DEFAULT '{}',
  saved_filters JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Transaction data with enhanced fields
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id TEXT UNIQUE NOT NULL,
  store_id TEXT NOT NULL,
  region TEXT NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  peso_value DECIMAL(15,2) NOT NULL,
  units INTEGER NOT NULL,
  duration_seconds INTEGER,
  category TEXT NOT NULL,
  brand TEXT,
  sku TEXT,
  customer_age_bracket TEXT,
  customer_gender TEXT,
  request_method TEXT,
  store_suggestion_accepted BOOLEAN,
  substitution_made BOOLEAN,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Aggregated metrics for performance
CREATE TABLE daily_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  store_id TEXT,
  region TEXT,
  total_transactions INTEGER NOT NULL,
  total_revenue DECIMAL(15,2) NOT NULL,
  avg_transaction_value DECIMAL(10,2),
  total_units INTEGER,
  top_categories JSONB,
  top_brands JSONB,
  customer_demographics JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(date, store_id)
);

-- AI insights storage
CREATE TABLE ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  insight_type TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB,
  relevance_score DECIMAL(3,2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_dashboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for dashboard_configs
CREATE POLICY "All users can view dashboard configs"
  ON dashboard_configs FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for user_dashboards
CREATE POLICY "Users can manage their own dashboards"
  ON user_dashboards FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for transactions (role-based)
CREATE POLICY "Executive can view all transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'executive'
    )
  );

CREATE POLICY "Regional managers can view their region"
  ON transactions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'regional_manager'
      AND profiles.region = transactions.region
    )
  );

CREATE POLICY "Store owners can view their store"
  ON transactions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'store_owner'
      AND profiles.store_id = transactions.store_id
    )
  );

CREATE POLICY "Analysts can view all transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'analyst'
    )
  );

-- Similar RLS policies for daily_metrics
CREATE POLICY "Executive can view all metrics"
  ON daily_metrics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'executive'
    )
  );

CREATE POLICY "Regional managers can view their region metrics"
  ON daily_metrics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'regional_manager'
      AND profiles.region = daily_metrics.region
    )
  );

CREATE POLICY "Store owners can view their store metrics"
  ON daily_metrics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'store_owner'
      AND profiles.store_id = daily_metrics.store_id
    )
  );

CREATE POLICY "Analysts can view all metrics"
  ON daily_metrics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'analyst'
    )
  );

-- RLS Policies for AI insights
CREATE POLICY "Users can view their own insights"
  ON ai_insights FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can create insights for users"
  ON ai_insights FOR INSERT
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_transactions_timestamp ON transactions(timestamp);
CREATE INDEX idx_transactions_store_id ON transactions(store_id);
CREATE INDEX idx_transactions_region ON transactions(region);
CREATE INDEX idx_daily_metrics_date ON daily_metrics(date);
CREATE INDEX idx_daily_metrics_store_id ON daily_metrics(store_id);
CREATE INDEX idx_ai_insights_user_id ON ai_insights(user_id);

-- Insert default dashboard configurations
INSERT INTO dashboard_configs (role, config, widgets, layout) VALUES
('executive', 
  '{"theme": "dark", "refreshInterval": 300}',
  '["revenue_kpi", "market_trends", "risk_alerts", "executive_summary"]',
  '{"grid": [{"i": "revenue_kpi", "x": 0, "y": 0, "w": 6, "h": 2}, {"i": "market_trends", "x": 6, "y": 0, "w": 6, "h": 2}]}'
),
('regional_manager',
  '{"theme": "dark", "refreshInterval": 600}',
  '["regional_performance", "store_comparison", "compliance_alerts", "revenue_forecast"]',
  '{"grid": [{"i": "regional_performance", "x": 0, "y": 0, "w": 12, "h": 3}]}'
),
('analyst',
  '{"theme": "dark", "refreshInterval": 900}',
  '["sku_analysis", "trend_explorer", "substitution_patterns", "deep_analytics"]',
  '{"grid": [{"i": "sku_analysis", "x": 0, "y": 0, "w": 8, "h": 4}]}'
),
('store_owner',
  '{"theme": "light", "refreshInterval": 1800}',
  '["daily_performance", "inventory_alerts", "top_products", "customer_insights"]',
  '{"grid": [{"i": "daily_performance", "x": 0, "y": 0, "w": 12, "h": 2}]}'
);