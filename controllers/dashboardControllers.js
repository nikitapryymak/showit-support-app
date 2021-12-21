const { google } = require('googleapis');
const oAuth2Client = require('../config/oAuth2Client');
const filterPeopleWhoAreOut = require('../helpers/filter');
const { getDescription, hasRole, isOut } = require('../helpers/roles');

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
        timeZone: 'America/Phoenix'
      });

      let eventData = calRes.data.items.map(event => ({
        name: event.summary,
        start: isOut(event.summary) ? null : event.start.dateTime,
        end: isOut(event.summary) ? null : event.end.dateTime,
        url: event.htmlLink
      }));

      let workingToday = filterPeopleWhoAreOut(eventData).sort((a, b) => { return new Date(a.start).getHours() - new Date(b.start).getHours() });
      let backupRoles = eventData.filter(e => !e.start && !e.end && hasRole(e.name));
      let outToday = eventData.filter(e => isOut(e.name));
      let events = [
          ...workingToday,
        ...backupRoles,
        ...outToday
      ];
      res.render('dashboard', { events, error: null, getDescription });
    } catch (err) {
      res.render('dashboard', { error: err.message, events: null });
    }
}