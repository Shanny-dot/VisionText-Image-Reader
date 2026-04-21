require('dotenv').config();
const express = require('express');
const cors = require('cors');

const uploadRouter = require('./routes/upload');
const historyRouter = require('./routes/history');

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Routes
app.use('/api', uploadRouter);
app.use('/api', historyRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
