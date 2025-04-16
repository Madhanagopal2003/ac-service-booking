// server.js
const express = require('express');
const path = require('path');
const { saveBooking, Booking } = require('./database');

const app = express();
const PORT = 3000;

// ✅ Middleware
app.use(express.json()); // Replaces body-parser
app.use(express.urlencoded({ extended: true }));

// ✅ Serve static files (except admin.html - handled below)
app.use(express.static(path.join(__dirname, 'public'), {
  index: 'index.html',
  extensions: ['html'],
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('admin.html')) {
      // Extra layer of security
      res.set('Content-Security-Policy', "default-src 'self'");
    }
  }
}));

// 🔐 Basic Auth Middleware for /admin.html
app.get('/admin.html', (req, res) => {
  const auth = { login: 'admin', password: '1234' }; // 🔐 Credentials

  const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
  const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');

  if (login === auth.login && password === auth.password) {
    return res.sendFile(path.join(__dirname, 'public', 'admin.html'));
  }

  res.set('WWW-Authenticate', 'Basic realm="Admin Area"');
  return res.status(401).send('Authentication Required.');
});

// 📥 Book a service
app.post('/book', async (req, res) => {
  const { name, phone, address, service, datetime } = req.body;

  let fixedPhone = phone;
  if (!phone.startsWith('+')) {
    fixedPhone = '+91' + phone.trim().replace(/^0+/, '');
  }

  try {
    await saveBooking({ name, phone: fixedPhone, address, service, datetime });
    return res.json({ success: true, message: '✅ Booking confirmed and saved to database.' });
  } catch (err) {
    console.error('❌ Booking Save Error:', err);
    return res.status(500).json({ success: false, message: '❌ Failed to save booking.', error: err.message });
  }
});

// 📤 Fetch all bookings (admin)
app.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    return res.json({ success: true, data: bookings });
  } catch (err) {
    console.error('❌ Booking Fetch Error:', err);
    return res.status(500).json({ success: false, message: '❌ Failed to fetch bookings.', error: err.message });
  }
});

// 🚀 Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
