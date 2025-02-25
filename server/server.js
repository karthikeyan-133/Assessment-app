const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const quizRoutes = require('./routes/quizRoutes');
const adminRoutes = require('./routes/admin');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const topicsRouter = require('./routes/topicsRouter');
const interviewCallLetterRoutes = require('./routes/CallLetterRoutes');
const JobOfferLetterRoutes = require('./routes/JobOfferRoutes');
const cors = require('cors');


dotenv.config();

const app = express();
connectDB()
  .then(() => console.log('Database connected successfully'))
  .catch((err) => {
    console.error('Database connection error:', err);
    process.exit(1);  // Exit process with failure
});

const allowedOrigins = [
  'http://localhost:5173',
  'https://assessment-app-client.onrender.com',
  process.env.VITE_API_URL,
];

app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],   // Add other methods as needed
  allowedHeaders: ['Content-Type', 'Authorization'],  // Adjust headers if you have custom ones
  credentials: true   // Enable if you need to send cookies or authorization headers
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.get('/test', (req, res) => {
    res.json({ message: 'Test route working' });
});
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`, {
        query: req.query,
        body: req.body
    });
    next();
});

app.use('/users', userRoutes);
app.use('/quiz', quizRoutes);
app.use('/leaderboard', leaderboardRoutes);
app.use('/interview-call-letter', interviewCallLetterRoutes)
app.use('/job-offer-letter', JobOfferLetterRoutes)
app.use('/topics', topicsRouter);
app.use('/admin', adminRoutes);
app.get('/', (req, res) => {
    res.send('API is running');
});
app.use((req, res) => {
    console.log('404 - Route not found:', req.url);
    res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
