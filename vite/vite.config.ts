import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    {
      name: 'serve-multiple-csv',
      configureServer(server) {
        const outputDir = path.resolve(__dirname, '../wrk/output');

        // Serve CSV content
        server.middlewares.use('/data/', (req, res) => {
          const fileName = req.url?.replace('/data/', '');
          const safeFileName = path.basename(fileName || '');
          const filePath = path.join(outputDir, safeFileName);

          if (!fs.existsSync(filePath)) {
            res.statusCode = 404;
            res.end('CSV file not found');
            return;
          }

          res.setHeader('Content-Type', 'text/csv');
          fs.createReadStream(filePath).pipe(res);
        });

        // List all CSV files
        server.middlewares.use('/list-csv', (_req, res) => {
          fs.readdir(outputDir, (err, files) => {
            if (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'Unable to read directory' }));
              return;
            }

            const csvFiles = files.filter((f) => f.endsWith('.csv'));
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(csvFiles));
          });
        });
      },
    },
  ],
});
