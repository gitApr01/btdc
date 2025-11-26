import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import testRoutes from './routes/tests';
import caseRoutes from './routes/cases';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/cases', caseRoutes);

app.get('/', (req, res) => {
  res.send('Blood Test App API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
