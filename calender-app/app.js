const express = require('express');
const path = require('path');
const { google } = require('googleapis');
const app = express();
const calenderid=require('dotenv').config();

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Your Google API credentials
const credentials = require('./calender-app-407412-0efd1ca8a3bc.json');
const { client_email, private_key } = credentials;

// Set up Google Calendar API
const calendar = google.calendar('v3');
const auth = new google.auth.JWT({
  email: client_email,
  key: private_key,
  scopes: ['https://www.googleapis.com/auth/calendar'],
});

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/schedule', express.json(), async (req, res) => {
  const { name, email, time } = req.body;

  try {
    // Create a Google Calendar event
    const event = await calendar.events.insert({
      auth,
      calendarId: calenderid,
      resource: {
        summary: `Meeting with ${name}`,
        description: `Email: ${email}`,
        start: {
          dateTime: time,
          timeZone: 'UTC',
        },
        end: {
          dateTime: new Date(new Date(time).getTime() + 60 * 60 * 1000), // 1 hour meeting
          timeZone: 'UTC',
        },
      },
    });

    // Extract Google Meet link from the event
    const meetLink = event.data.hangoutLink;

    res.json({ success: true, meetLink });
  } catch (error) {
    console.error('Error scheduling meeting:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


