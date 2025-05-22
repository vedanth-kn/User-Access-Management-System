import express from 'express';
import { AppDataSource } from './config/data-source';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import { softwareRoutes } from './routes/software';
import { requestRoutes } from './routes/request';
const cors = require("cors");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.get('/', (req, res) => {
  res.send('API is running');
});
app.use('/api/auth', authRoutes);
app.use('/api/software', softwareRoutes);
app.use('/api/requests', requestRoutes);


AppDataSource.initialize()
  .then(() => {
    console.log('Connected to PostgreSQL');
    app.listen(5000, () => console.log('Server running on http://localhost:5000'));
  })
  .catch((error) => console.error('DB Connection Error:', error));
