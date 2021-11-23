const { WebClient } = require('@slack/web-api');
const { formatTime, getDay } = require('../helpers/formatTime');
const { getDescription, hasRole } = require('../helpers/roles');

const slack = new WebClient(process.env.BOT_TOKEN);

module.exports.postToChannel = async (req, res) => {
  const { events } = req.body;
  if (!events || !events.length) return res.status(400).json({ error: 'No events sent.' });

  let blocks = [
		{
			type: 'header',
			text: {
				type: 'plain_text',
				text: `:calendar:  SCHEDULE ${getDay()} :calendar:`
			}
		}
  ];
  events.forEach(({ name, start, end }) => {
    if (start && end) {
      const startTime = formatTime(new Date(start).toLocaleTimeString('en-US', { timeZone:'America/Phoenix' }));
      const endTime = formatTime(new Date(end).toLocaleTimeString('en-US', { timeZone:'America/Phoenix' }));
      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*${name}* \n ${startTime} -- ${endTime}`
      }});
    } else {
      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*${name.split(' ')[0]} ${name.split(' ')[1]}* ${!hasRole(name) ? ':no_entry:' : ''} \n ${getDescription(name)}`
      }});
    }
  });

    try {
      await slack.chat.postMessage({
        channel: process.env.SLACK_CHANNEL,
        text: 'Support Schedule '+getDay(),
        blocks
      });
      res.status(200).json({ message: 'success!' });
      
    } catch (error) {
      console.log('SLACK ERROR', error);
      res.status(400).json({ error: error.data.error });
    }
}