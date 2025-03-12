import express from 'express';
import cors from 'cors';
import setupSwagger from './swagger/swagger';

import tarefaRouter from './routes/tarefaRouter';

const app = express();

setupSwagger(app);

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true,
  }),
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Rotas
app.use('/api/tarefas', tarefaRouter);

app.use((request, response) => {
  response.status(404).json({ message: 'Rota não Encontrada' });
});

export default app;
