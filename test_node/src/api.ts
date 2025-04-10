import axios from 'axios';

const run = async () => {
  const url = 'http://localhost:8080/';

  console.log(`🔍 Benchmarking GET ${url}`);
  console.time('⏱️ Rust API response time');

  try {
    const res = await axios.get(url);
    console.timeEnd('⏱️ Rust API response time');
    console.log(`📨 Response: ${res.data}`);
  } catch (err: any) {
    console.error('❌ Failed to fetch:', err.message || err);
  }
};

run();
