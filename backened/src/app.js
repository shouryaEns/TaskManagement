require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const connectDB = require('./config/db');
const requestLogger = require('./middlewares/requestLogger');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'https://task-management-frontend.vercel.app/api',
];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(morgan('combined'));
app.get('/', (req, res) => {
  res.json({ message: 'TaskFlow Pro API is running' });
});
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use(errorHandler);
app.use(requestLogger);

// const PORT = process.env.PORT || 5000;
// connectDB();
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

connectDB();
module.exports = app;
