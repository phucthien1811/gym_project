import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/config.js';
import api from './routes/index.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1', api);


app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Internal error' });
});

export default app;
