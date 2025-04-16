import express from 'express';

const app = express();

app.get('/', (_req, res) => {
  res.send('Hello from Node.js');
});

app.listen(3000, '0.0.0.0', () => {
  console.log('✅ Server running on http://0.0.0.0:3000');
});
