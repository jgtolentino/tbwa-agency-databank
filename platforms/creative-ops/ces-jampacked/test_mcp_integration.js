import axios from 'axios';

const MCP_URL = 'https://mcp-sqlite-server.onrender.com';

async function testMCPIntegration() {
  console.log('🧪 Testing MCP Integration...\n');
  
  const tests = {
    health: false,
    getCampaigns: false,
    analyzeCampaign: false,
    getInsights: false
  };
  
  // 1. Health Check
  console.log('1️⃣ Testing Health Check...');
  try {
    const health = await axios.get(`${MCP_URL}/health`);
    console.log('✅ Health Check:', health.data);
    tests.health = true;
  } catch (error) {
    console.error('❌ Health Check Failed:', error.message);
    if (error.response) {
      console.log('   Response:', error.response.status, error.response.data);
    }
  }
  
  // 2. Get Campaigns
  console.log('\n2️⃣ Testing Get Campaigns...');
  try {
    const campaigns = await axios.get(`${MCP_URL}/api/jampacked/campaigns`);
    const count = campaigns.data.length || campaigns.data.campaigns?.length || 0;
    console.log(`✅ Campaigns: Found ${count} campaigns`);
    if (count > 0) {
      const sample = campaigns.data[0] || campaigns.data.campaigns?.[0];
      console.log('   Sample campaign:', {
        name: sample.name || sample.title,
        brand: sample.brand,
        score: sample.creative_effectiveness_score
      });
    }
    tests.getCampaigns = true;
  } catch (error) {
    console.error('❌ Get Campaigns Failed:', error.message);
    if (error.response) {
      console.log('   Response:', error.response.status, error.response.data);
    }
  }
  
  // 3. Test Analysis
  console.log('\n3️⃣ Testing Campaign Analysis...');
  try {
    const analysis = await axios.post(`${MCP_URL}/api/jampacked/analyze`, {
      campaignData: {
        campaign_name: 'Test Campaign',
        brand: 'Test Brand',
        metrics: ['effectiveness', 'roi']
      },
      options: {
        includeInsights: true,
        includeRecommendations: true
      }
    });
    console.log('✅ Analysis:', analysis.data);
    tests.analyzeCampaign = true;
  } catch (error) {
    console.error('❌ Analysis Failed:', error.message);
    if (error.response) {
      console.log('   Response:', error.response.status, error.response.data);
    }
  }
  
  // 4. Get Insights
  console.log('\n4️⃣ Testing Get Insights...');
  try {
    const insights = await axios.get(`${MCP_URL}/api/jampacked/insights`, {
      params: {
        industry: 'retail',
        timeframe: '30d'
      }
    });
    console.log('✅ Insights:', insights.data);
    tests.getInsights = true;
  } catch (error) {
    console.error('❌ Get Insights Failed:', error.message);
    if (error.response) {
      console.log('   Response:', error.response.status, error.response.data);
    }
  }
  
  // Summary
  console.log('\n📊 Test Summary:');
  console.log('================');
  let passed = 0;
  let failed = 0;
  
  for (const [test, result] of Object.entries(tests)) {
    console.log(`${result ? '✅' : '❌'} ${test}: ${result ? 'PASSED' : 'FAILED'}`);
    if (result) passed++;
    else failed++;
  }
  
  console.log('\n📈 Results:');
  console.log(`   Passed: ${passed}/${Object.keys(tests).length}`);
  console.log(`   Failed: ${failed}/${Object.keys(tests).length}`);
  
  if (passed === Object.keys(tests).length) {
    console.log('\n🎉 All tests passed! MCP integration is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the MCP server configuration.');
  }
  
  // Additional info
  console.log('\n📝 Next Steps:');
  console.log('1. If tests failed, check MCP server logs');
  console.log('2. Run import_to_mcp.js to load campaign data');
  console.log('3. Update askCesApi.ts to use MCP endpoints');
  console.log('4. Test Ask CES chat interface with real queries');
}

// Run the tests
testMCPIntegration().then(() => {
  console.log('\n✨ Test completed');
}).catch(error => {
  console.error('\n❌ Test failed:', error);
});