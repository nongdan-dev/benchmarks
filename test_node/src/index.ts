// 👉 Node.js (TypeScript) benchmark implementation
// --- REST API ---
import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { Pool } from 'pg';
import yargs from 'yargs';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/api', (req: Request, res: Response) => {
  res.json({ message: 'Hello from Node.js!' });
});

const server = createServer(app);

// --- WebSocket ---
const wss = new WebSocketServer({ server });
wss.on('connection', ws => {
  ws.on('message', message => {
    ws.send(`Echo from Node.js: ${message}`);
  });
});

// --- PostgreSQL ---
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/test',
});

app.get('/pg-count', async (_req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM users');
    res.json({ count: result.rows[0].count });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- CLI Tool ---
yargs.command(
  'hello [name]',
  'Say hello',
  yargs => yargs.positional('name', { type: 'string', default: 'world' }),
  argv => {
    console.log(`Hello, ${argv.name} from Node.js CLI!`);
  }
).help().argv;

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
