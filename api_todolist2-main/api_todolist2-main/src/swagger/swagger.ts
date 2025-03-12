import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { Request, Response } from 'express';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerFile = path.resolve(__dirname, 'swagger.json');
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerFile, 'utf-8'));

const setupSwagger = (app: any) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.get('/api-docs.json', (req: Request, res: Response) => {
    res.json(swaggerDocument);
  });
};

export default setupSwagger;
