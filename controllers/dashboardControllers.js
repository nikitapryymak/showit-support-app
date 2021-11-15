const { google } = require('googleapis');
const oAuth2Client = require('../config/oAuth2Client');

module.exports.getDashboard = async (req, res) => {

    const { access_token, refresh_token } = req.user;
    if (!access_token || !refresh_token) return res.error(400).json({ error: 'No tokens found.' });

    oAuth2Client.setCredentials({ access_token, refresh_token });
    const calendar = google.calendar({version: 'v3', auth: oAuth2Client });
    const timeMin = new Date(new Date().setHours(1, 0, 0)).toISOString(); // beginning of the day
    const timeMax = new Date(new Date().setHours(23, 59, 59)).toISOString(); // end of the day

    try {
      const calRes = await calendar.events.list({
        calendarId: process.env.CALENDAR_ID,
        timeMin,
        timeMax,
      });

      let events = calRes.data.items.map(event => ({
        name: event.summary,
        start: event.start.dateTime,
        end: event.end.dateTime,
        url: event.htmlLink
      }));

      events = events.sort((a, b) => { return new Date(a.start) - new Date(b.start) });

      res.render('dashboard', { events, error: null });
    } catch (err) {
      res.render('dashboard', { error: err.message, events: null });
    }
}