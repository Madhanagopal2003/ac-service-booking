const mongoose = require('mongoose');

// 🔐 MongoDB Atlas URI (encoded '@' as '%40' in password)
const uri = 'mongodb+srv://madhan6079804:%40Madhan143@booking.jcn8cyb.mongodb.net/ac_service?retryWrites=true&w=majority&appName=booking';

// ✅ Connect to MongoDB Atlas
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Define booking schema
const bookingSchema = new mongoose.Schema({
  name: String,
  phone: String,
  address: String,
  service: String,
  datetime: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// ✅ Model
const Booking = mongoose.model('Booking', bookingSchema);

// ✅ Save booking
function saveBooking(data) {
  const booking = new Booking(data);
  return booking.save();
}

// ✅ Export model and save function
module.exports = {
  saveBooking,
  Booking
};
