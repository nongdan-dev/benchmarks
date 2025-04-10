import WebSocket from 'ws';
import { performance } from 'perf_hooks';

const URL = 'ws://127.0.0.1:9001/ws';
const TOTAL_MESSAGES = 1000;

const ws = new WebSocket(URL);

ws.on('open', () => {
  console.log(`🚀 Connected to ${URL}`);
  let count = 0;
  const start = performance.now();

  const sendMessage = () => {
    if (count < TOTAL_MESSAGES) {
      ws.send(`ping ${count}`);
      count++;
    }
  };

  ws.on('message', (data) => {
    if (count < TOTAL_MESSAGES) {
      sendMessage();
    } else if (count === TOTAL_MESSAGES) {
      const end = performance.now();
      console.log(`✅ ${TOTAL_MESSAGES} messages echoed in ${(end - start).toFixed(2)} ms`);
      ws.close();
    }
  });

  sendMessage(); // Start the loop
});

ws.on('error', (err) => {
  console.error('❌ WebSocket error:', err);
});
