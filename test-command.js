const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://localhost:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

const Schema = mongoose.Schema;
const mytestingschema = new Schema({
  deviceName: String,
  driverVersion: String
});

const DriverModel = mongoose.model('Driver', mytestingschema);

app.use(express.json());

app.post('/savedriverdata', async (req, res) => {
  try {
    const driverData = req.body; 
    for (const driver of driverData) {
      await DriverModel.create({
        deviceName: driver.DeviceName,
        driverVersion: driver.DriverVersion
      });
    }
    res.status(200).json({ message: 'Driver data saved successfully' });
  } catch (error) {
    console.error('Error saving driver data:', error);
    res.status(500).json({ error: 'Error saving driver data' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
