import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SERVER_URL = 'http://localhost:5000/api/disease/disease';
const ML_SERVICE_URL = 'http://127.0.0.1:8000/predict/disease';

// Test with a simple image - creating a test image for demonstration
async function createTestImage(filename) {
  // Creating a minimal valid PNG (1x1 pixel white image)
  const pngData = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
    0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
    0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0x99, 0x63, 0xF8, 0xCF, 0xC0, 0x00,
    0x00, 0x00, 0x03, 0x00, 0x01, 0x6B, 0x7F, 0xEE, 0xBF, 0x00, 0x00, 0x00,
    0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
  ]);

  const uploadDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filepath = path.join(uploadDir, filename);
  fs.writeFileSync(filepath, pngData);
  return filepath;
}

async function testDiseaseDetectionAPI() {
  console.log('🔍 Testing Disease Detection API...\n');

  try {
    // Create a test image
    console.log('📸 Creating test image...');
    const testImagePath = await createTestImage('test-leaf.png');
    console.log(`✅ Test image created at: ${testImagePath}\n`);

    // Test 1: Direct ML Service Test (if available)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('TEST 1: Direct ML Service Request');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    try {
      const mlFormData = new FormData();
      mlFormData.append('file', fs.createReadStream(testImagePath));

      console.log(`📤 Sending request to: ${ML_SERVICE_URL}`);
      const mlResponse = await axios.post(ML_SERVICE_URL, mlFormData, {
        headers: mlFormData.getHeaders(),
        timeout: 30000,
      });

      console.log('✅ ML Service Response:');
      console.log(JSON.stringify(mlResponse.data, null, 2));
      console.log('\n');
    } catch (error) {
      console.log('⚠️  ML Service not available or error occurred');
      if (error.message) console.log(`Error: ${error.message}`);
      console.log('\n');
    }

    // Test 2: Express Server API Test
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('TEST 2: Express Server API Request');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    try {
      const serverFormData = new FormData();
      serverFormData.append('image', fs.createReadStream(testImagePath));

      console.log(`📤 Sending request to: ${SERVER_URL}`);
      const serverResponse = await axios.post(SERVER_URL, serverFormData, {
        headers: serverFormData.getHeaders(),
        timeout: 30000,
      });

      console.log('✅ Server API Response:');
      console.log(JSON.stringify(serverResponse.data, null, 2));
      console.log('\n');

      // Validate response structure
      console.log('📋 Response Validation:');
      if (serverResponse.data.success !== undefined) {
        console.log(`✅ 'success' field: ${serverResponse.data.success}`);
      }
      if (serverResponse.data.prediction) {
        console.log(`✅ 'prediction' field: ${serverResponse.data.prediction}`);
        const validPredictions = ['Disease', 'Healthy'];
        if (validPredictions.includes(serverResponse.data.prediction)) {
          console.log(`   └─ Valid prediction: ${serverResponse.data.prediction}`);
        }
      }
      if (serverResponse.data.confidence) {
        console.log(`✅ 'confidence' field: ${serverResponse.data.confidence}%`);
      }
      console.log('\n');

    } catch (error) {
      console.log('❌ Server API Test Failed');
      if (error.code === 'ECONNREFUSED') {
        console.log('⚠️  Connection refused - Is the Express server running on port 5000?');
      } else if (error.message) {
        console.log(`Error: ${error.message}`);
      }
      if (error.response?.data) {
        console.log('Response:', JSON.stringify(error.response.data, null, 2));
      }
      console.log('\n');
    }

    // Cleanup
    console.log('🧹 Cleaning up test files...');
    if (fs.existsSync(testImagePath)) {
      fs.unlinkSync(testImagePath);
      console.log('✅ Test image deleted\n');
    }

    // Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('TEST SUMMARY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n✅ API Structure:');
    console.log('  • Express Server: http://localhost:5000');
    console.log('  • Disease Detection Endpoint: /api/disease/disease');
    console.log('  • Method: POST');
    console.log('  • Form Data: "image" field (multipart/form-data)');
    console.log('\n✅ Expected Response:');
    console.log('  • success: true/false');
    console.log('  • prediction: "Disease" or "Healthy"');
    console.log('  • confidence: percentage (0-100)\n');

  } catch (error) {
    console.log('❌ Test Failed:', error.message);
  }
}

// Run the test
testDiseaseDetectionAPI();
