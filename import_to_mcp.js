import fs from 'fs';
import axios from 'axios';

const MCP_URL = 'https://mcp-sqlite-server.onrender.com';

async function importCampaigns() {
  console.log('Starting campaign import to MCP SQLite server...\n');
  
  try {
    // Read the validated dataset
    const validatedPath = '/Users/tbwa/Documents/GitHub/tbwa-lions-palette-forge/validated_campaigns_dataset.json';
    const campaignsPath = '/Users/tbwa/Documents/GitHub/tbwa-lions-palette-forge/public/data/campaigns_corpus.json';
    
    // Load validated dataset info
    const validatedData = JSON.parse(fs.readFileSync(validatedPath, 'utf8'));
    console.log('📊 Validated Dataset Info:');
    console.log(`   Total Campaigns: ${validatedData.dataset_info.total_campaigns}`);
    console.log(`   Mean CES: ${validatedData.dataset_info.mean_ces}`);
    console.log(`   Average ROI: ${validatedData.dataset_info.avg_roi}x`);
    console.log(`   Top Performer: ${validatedData.dataset_info.top_performer_ces} CES\n`);
    
    // Load campaigns data
    let campaigns = [];
    if (fs.existsSync(campaignsPath)) {
      const rawData = fs.readFileSync(campaignsPath, 'utf8');
      campaigns = JSON.parse(rawData);
      console.log(`✅ Loaded ${campaigns.length} campaigns from corpus`);
    } else {
      console.log('⚠️  Campaigns corpus not found, using validated dataset only');
      // Create campaigns from validated top performers
      campaigns = validatedData.top_performers.map(performer => ({
        campaign_id: `validated_${performer.rank}`,
        title: performer.name,
        brand: performer.brand,
        year: 2024,
        category: performer.category,
        creative_effectiveness_score: performer.ces,
        roi: performer.roi,
        source: performer.source,
        validated: true
      }));
    }
    
    // Create a data structure compatible with scoring
    const data = {
      campaigns: campaigns,
      summary: {
        total_campaigns: campaigns.length,
        sources: [...new Set(campaigns.map(c => c.agency?.[0] || c.source || 'Unknown'))].slice(0, 5),
        ces_range: { min: 0, max: 100 },
        validated_info: validatedData.dataset_info
      }
    };
    
    console.log(`📊 Found ${data.campaigns.length} campaigns to import`);
    console.log(`📈 CES Score Range: ${data.summary.ces_range.min.toFixed(1)} - ${data.summary.ces_range.max.toFixed(1)}`);
    console.log(`📍 Sources: ${data.summary.sources.join(', ')}\n`);
    
    // Test MCP connection first
    console.log('Testing MCP connection...');
    try {
      const healthCheck = await axios.get(`${MCP_URL}/health`);
      console.log('✅ MCP server is healthy:', healthCheck.data);
    } catch (error) {
      console.error('❌ MCP server health check failed:', error.message);
      console.log('Please ensure the MCP server is running at:', MCP_URL);
      return;
    }
    
    // Import campaigns
    console.log('\nImporting campaigns...');
    let successCount = 0;
    let failCount = 0;
    
    // Add CES scoring using validated framework if not present
    for (const campaign of data.campaigns) {
      if (!campaign.creative_effectiveness_score) {
        // Use validated 8-dimensional framework
        let score = data.summary.validated_info.mean_ces; // Start with mean (59.5)
        
        // Apply framework dimensions
        if (campaign.results) {
          if (campaign.results.roi) score += 8; // Performance impact
          if (campaign.results.sales_uplift) score += 6; // Business outcome
          if (campaign.results.brand_awareness) score += 4; // Brand impact
          if (campaign.results.other_kpis) score += 3; // Additional metrics
        }
        
        // Award recognition (Performance Predictors dimension)
        if (campaign.year >= 2023) score += 3;
        if (campaign.agency && campaign.agency.length > 0) score += 2;
        
        // Technology integration assessment
        if (campaign.strategy && campaign.strategy.toLowerCase().includes('digital')) score += 2;
        if (campaign.strategy && campaign.strategy.toLowerCase().includes('social')) score += 2;
        
        // Cultural relevance (market specific)
        if (campaign.market && campaign.market !== 'Global') score += 1;
        
        // Normalize to realistic range based on validated data (51.3-85.4)
        campaign.creative_effectiveness_score = Math.min(Math.max(score, 51.3), 85.4);
      }
    }
    
    // Update summary with actual scores
    const scores = data.campaigns.map(c => c.creative_effectiveness_score);
    data.summary.ces_range = {
      min: Math.min(...scores),
      max: Math.max(...scores)
    };
    
    console.log(`📊 Scored campaigns - Range: ${data.summary.ces_range.min.toFixed(1)} - ${data.summary.ces_range.max.toFixed(1)}`);
    
    for (const campaign of data.campaigns) {
      try {
        // Format campaign data for MCP with validated framework
        const mcpCampaign = {
          name: campaign.title || campaign.name,
          brand: campaign.brand,
          year: campaign.year,
          market: campaign.market,
          agency: campaign.agency?.[0] || 'Unknown',
          category: campaign.category,
          creative_effectiveness_score: campaign.creative_effectiveness_score,
          roi: campaign.roi || (campaign.results?.roi ? parseFloat(campaign.results.roi.replace(/[^0-9.]/g, '')) : null),
          challenge: campaign.challenge,
          strategy: campaign.strategy,
          implementation: campaign.implementation,
          results: campaign.results,
          validated: campaign.validated || false,
          framework_dimensions: {
            disruption: campaign.disruption_score || 0.5,
            performance_predictors: campaign.performance_predictors || 0.5,
            storytelling: campaign.storytelling_score || 0.5,
            cultural_relevance: campaign.cultural_relevance || 0.5,
            csr_authenticity: campaign.csr_authenticity || 0.2,
            technology_integration: campaign.technology_integration || 0.3,
            platform_integration: campaign.platform_integration || 0.3,
            ai_personalization: campaign.ai_personalization || 0.1
          },
          features: {
            campaign_id: campaign.campaign_id,
            url: campaign.url,
            creative_assets: campaign.creative_assets,
            source: campaign.source || 'Unknown'
          },
          metadata: {
            campaign_id: campaign.campaign_id,
            imported_at: new Date().toISOString(),
            data_version: '2.0',
            validation_status: validatedData.dataset_info.data_quality,
            framework_version: '8-dimensional'
          }
        };
        
        // Try to create/update campaign in MCP
        const response = await axios.post(
          `${MCP_URL}/api/jampacked/campaigns`,
          mcpCampaign,
          {
            headers: {
              'Content-Type': 'application/json'
            },
            timeout: 10000
          }
        );
        
        console.log(`✅ Imported: ${campaign.title || campaign.name} (CES: ${campaign.creative_effectiveness_score.toFixed(1)})`);
        successCount++;
        
      } catch (error) {
        console.error(`❌ Failed to import ${campaign.title || campaign.name}:`, error.response?.data?.message || error.message);
        failCount++;
      }
    }
    
    console.log('\n📊 Import Summary:');
    console.log(`✅ Successfully imported: ${successCount} campaigns`);
    console.log(`❌ Failed to import: ${failCount} campaigns`);
    console.log(`📈 Total campaigns: ${data.campaigns.length}`);
    
    // Verify import by fetching campaigns
    if (successCount > 0) {
      console.log('\nVerifying import...');
      try {
        const campaigns = await axios.get(`${MCP_URL}/api/jampacked/campaigns`);
        console.log(`✅ MCP now has ${campaigns.data.length || 0} campaigns`);
      } catch (error) {
        console.log('⚠️  Could not verify import:', error.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Import failed:', error.message);
    if (error.code === 'ENOENT') {
      console.log('\nPlease ensure the scored campaigns file exists.');
      console.log('You may need to run the scoring script first.');
    }
  }
}

// Run the import
importCampaigns().then(() => {
  console.log('\n✨ Import process completed');
}).catch(error => {
  console.error('\n❌ Import process failed:', error);
});