const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Patient = require('./models/Patient');
const Prescription = require('./models/Prescription');
const Inventory = require('./models/Inventory');

dotenv.config();

const importData = async () => {
  try {
    // 1. Connect first (and WAIT for it)
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ DB Connected for Seeding');

    // 2. Wipe Everything
    await User.deleteMany();
    await Patient.deleteMany();
    await Prescription.deleteMany();
    await Inventory.deleteMany();
    console.log('🗑️  Data Destroyed...');

    // 3. Create The "God Mode" Developer
    await User.create({
        name: 'Lead Developer',
        email: 'dev@hospital.com',
        password: 'password123',
        role: 'developer'
    });

    // 4. Create a Restricted Admin
    await User.create({
        name: 'Hospital Director',
        email: 'admin@hospital.com',
        password: 'password123',
        role: 'admin'
    });

    // 5. Create Standard Staff (Optional, for testing)
    await User.create({
        name: 'Dr. House',
        email: 'doctor@hospital.com',
        password: 'password123',
        role: 'doctor'
    });

    await User.create({
        name: 'Reception Desk',
        email: 'reception@hospital.com',
        password: 'password123',
        role: 'reception'
    });
    
    await User.create({
        name: 'Pharmacist',
        email: 'pharmacy@hospital.com',
        password: 'password123',
        role: 'pharmacist'
    });

    console.log('🌱 Data Imported Successfully!');
    console.log('   Dev: dev@hospital.com');
    console.log('   Admin: admin@hospital.com');
    
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

importData();