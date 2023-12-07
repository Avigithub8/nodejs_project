function scheduleMeeting() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const time = document.getElementById('time').value;
    
    fetch('http://localhost:3000/schedule', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, time }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        document.getElementById('meetLink').innerHTML = `Meeting scheduled successfully. Google Meet Link: <a href="${data.meetLink}" target="_blank">${data.meetLink}</a>`;
      } else {
        document.getElementById('meetLink').innerHTML = `Error: ${data.error}`;
      }
    })
    .catch(error => {
      console.error('Error scheduling meeting:', error.message);
      document.getElementById('meetLink').innerHTML = 'An error occurred while scheduling the meeting.';
    });
  }
  