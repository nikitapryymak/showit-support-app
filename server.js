const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db.js');
const authRoutes = require('./routes/authRoutes.js');
const slackRoutes = require('./routes/slackRoutes.js');
const dashboardRoutes = require('./routes/dashboardRoutes.js');
const PORT = process.env.PORT || 5000;

connectDB();

// initialize modules and middleware
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: '*' }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use('/auth', authRoutes);

app.use('/slack', slackRoutes);

app.use('/dashboard', dashboardRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT} in ${process.env.NODE_ENV} environment`);
});
