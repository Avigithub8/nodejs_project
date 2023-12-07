const express = require('express');
const path = require('path');
const { google } = require('googleapis');
const app = express();
//require('dotenv').config();

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


const credentials = {
    "type": "service_account",
    "project_id": "calender-app-407412",
    "private_key_id": "0efd1ca8a3bc857969f6a5661911737286d42fe3",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCgTl7jpYN1ASx8\nVFBJPg89lE1fndjhMsxuGpSe1UJLoGARClyzUQUgskwi1wagkhNoU+IhGbOmZD/d\ncbcU8bokmjmacJIon4Rz3fBE4MO388/amzHTg3n5qcOl2dL5xdtoiiP3H/lYntEI\n1Ky7QoageeogsgZlngeYnk+YQm1+KtZMHyRsnWVCRtrfwzy5IUtDpao64+e+uKby\n02L0JsILnIwY+Ovy/8/P3ZslE4JrWtquSYQoh2rHjsvDyoltCe99xg8sRLfJar7s\nOZvVVPV95NAPKUlw5UIdrmGhTorDpJAvBI1F6yFTyUToOMz4X3IqrAY5IsqK/d6l\nOm44SbhFAgMBAAECggEAL2WclrBMQt76+TOwnUc1GF7t1ZSFGGh9mxxOzvt844Fi\nhgdLS1VsL7On4TE0a2tlQ5ZxqJnBzTOc0muZ1x51i/bxiyE3hb1MWznGnYbbN1tm\nHFuAiuo3uUKhbzsNLv56FdmqMpoIjlQ+t96xx5gu1+nT+KDKVWc5Fb3RCNKzLvch\nda7m5Es7q/OFCSVVrW0jTsDMCxdPj6k+HZXEfwXEHsWaxnC5uvD+wb9NHwQGSriU\npCzT6to+21Q8qs3LJ1LKjKvS9GnUpRb+ansieoHTJ/6nsdLkIuTljrxMqN86B1fN\n3WW+agHe66Ajw6PB9srYtdXDpcmHKKEU3lnpqmxhzQKBgQDWECGRpKhNTya0iiGZ\nG8NTAZbG3krexZb9qYp+P25zjy8n13/T12IXdN3zXO0TKPrphXujn5r/9FOS1yV3\n34yE5BwFCtUdn/+1GKHc3/JgDgy4l4ATNihz/maDbxVkiaMLmXExiIcNb4m21yQW\nQQ9JzLdwuWeuiKkan1UrcIj/PwKBgQC/ti3kwY+1amWW+wIw/ps/lq07KsW7+ghP\nsBk2PLPugqPvUeAJRpVqAFBabJDZeF88rgXus6yEVDpCCjFjjh/ySjSAXul9t+jK\n10IfWsr4+ZpzYxHVpIj7yT/DmV4CxcKCY3TKEpoCFs7a+ViZkGu8ms0uSHpY32In\n1/0D1girewKBgFv3OjTUROpR4xMVdTHOV7BFsn1l60yiHyiDulha8Bz9mwjG8MgW\ndLIXJ3PyrHfa11GUY3X8kB7+3RjtDc/eXwSI6/DOopjDsJwhJQk7vWm/H3/+tquK\nTP7ogSpegxZae430MklRmpQPI19GNt7IvMS8CuOHBCBb3irt4S10f6cJAoGBAL1K\n3snOrV0Nrz2CnslNvHDvECEpvJA881Prpxk8mtVYPRIin7nI7eL6aFzAcc2o4zCB\nC+6DjkYi/FsUwWtxe+26g1h1Xsr5emw+W1WmSl/H5U8ldQikK3WhYsp5dq/6IHKq\nTTjxYQvLBXiFV4xZY2eY2htnCRcTilGZHIRbI7hdAoGBAJ/TT6ztfzUPg24/8FpL\n1vJexvOzNeBzcRzlu0o+KvpPQ65vVV0hs6N2OaT0VJ+llClo+eIEfciD0GXYm8g1\nN/O/vHBVGbgNkSrekSlVKiRC8eoxPIrP+dBswBD3wOle0aCzIJgDcbYvcdrs66Sy\nJDc+I9DjCpdzvyAuEQjdAuT6\n-----END PRIVATE KEY-----\n",
    "client_email": "testing-google-calender-api@calender-app-407412.iam.gserviceaccount.com",
    "client_id": "113531752811430798415",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/testing-google-calender-api%40calender-app-407412.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"}
const { client_email, private_key } = credentials;


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
   
    const event = await calendar.events.insert({
      auth,
      calendarId: '2623fe876c316b2f00c5c182b4669c812c6cdd671cb9fd690a87a4900897c496@group.calendar.google.com',
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

   
    const meetLink = event.data.hangoutLink;

    res.json({ success: true, meetLink });
  } catch (error) {
    console.error('Error scheduling meeting:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});


//app.listen(3000);


