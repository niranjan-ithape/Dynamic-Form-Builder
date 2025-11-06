const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoute');
const formRoutes = require('./routes/formRoutes');
const submissionRoutes = require('./routes/submissionRoutes');

dotenv.config();
connectDB();

const app = express();


app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api', formRoutes);
app.use('/api', submissionRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
