const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

// Load env vars
dotenv.config();

// Initialize App
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(`✅ MongoDB Connected`))
  .catch(err => console.error(`❌ DB Error: ${err.message}`));

// Route Imports (We will create these files next)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/patients', require('./routes/patientRoutes'));
app.use('/api/prescriptions', require('./routes/prescriptionRoutes'));
app.use('/api/inventory', require('./routes/inventoryRoutes'));
app.use('/api/dispense', require('./routes/dispenseRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/lab', require('./routes/labRoutes'));
// ... inside server.js routes section ...
app.use('/api/public', require('./routes/publicRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});