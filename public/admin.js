// admin.js
async function loadBookings() {
    try {
      const res = await fetch('/bookings');
      const result = await res.json();
  
      if (result.success) {
        let html = `
          <table>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Service</th>
              <th>Date/Time</th>
              <th>Address</th>
            </tr>`;
        result.data.forEach(b => {
          html += `
            <tr>
              <td>${b.name}</td>
              <td>${b.phone}</td>
              <td>${b.service}</td>
              <td>${b.datetime}</td>
              <td>${b.address}</td>
            </tr>`;
        });
        html += `</table>`;
        document.getElementById('bookingsTable').innerHTML = html;
      } else {
        document.getElementById('bookingsTable').textContent = "❌ Could not fetch bookings.";
      }
    } catch (err) {
      console.error(err);
      document.getElementById('bookingsTable').textContent = "⚠️ Error fetching bookings.";
    }
  }
  
  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('isAdmin');
    window.location.href = 'login.html';
  });
  
  if (localStorage.getItem('isAdmin') !== 'true') {
    window.location.href = 'login.html';
  }
  
  loadBookings();
  