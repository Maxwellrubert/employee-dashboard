const axios = require('axios');

// Test the n8n webhook connection
const testWebhook = async () => {
  const webhookUrl = 'https://maxwell-rubert.app.n8n.cloud/webhook-test/send-email';
  
  const testData = {
    employee: {
      id: 'test-id',
      name: 'Test Employee',
      email: 'test@example.com',
      position: 'Test Position',
      department: 'Test Department'
    },
    emailType: 'general',
    customMessage: 'This is a test email from the Employee Dashboard system.',
    timestamp: new Date().toISOString()
  };

  console.log('🧪 Testing n8n webhook connection...');
  console.log('📍 Webhook URL:', webhookUrl);
  console.log('📤 Sending test data:', JSON.stringify(testData, null, 2));

  try {
    const response = await axios.post(webhookUrl, testData, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Webhook test successful!');
    console.log('📥 Response status:', response.status);
    console.log('📥 Response data:', response.data);
    
    return true;
  } catch (error) {
    console.log('❌ Webhook test failed!');
    
    if (error.code === 'ECONNREFUSED') {
      console.log('🔴 Connection refused - Is n8n running on http://localhost:5678?');
      console.log('💡 Start n8n with: npx n8n');
    } else if (error.response) {
      console.log('📥 Response status:', error.response.status);
      console.log('📥 Response data:', error.response.data);
    } else {
      console.log('🔴 Error:', error.message);
    }
    
    return false;
  }
};

// Run the test
testWebhook().then((success) => {
  process.exit(success ? 0 : 1);
});
