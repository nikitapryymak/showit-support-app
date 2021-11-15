const { WebClient } = require('@slack/web-api');
const { formatTime, getDay } = require('../helpers/formatTime');

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
  ]
  events.forEach(item => {
    const startTime = formatTime(new Date(item.start).toLocaleTimeString());
    const endTime = formatTime(new Date(item.end).toLocaleTimeString());
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*${item.name}* \n ${startTime} -- ${endTime}`
    }});
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