const { isOut, hasRole } = require("./roles")

// eventData: [
//      {
//          name: 'Zac Flathers || Zac Flathers (OUT)',
//          start: '2021-09-14T12:00:00-07:00',
//          end: '2021-09-14T14:00:00-07:00',
//          url: 'https://www.google.com/9tdXYzMnB'
//      }, ...
// ]

module.exports = (eventData) => {
    const peopleOut = eventData.filter(e => isOut(e.name)).map(e => e.name);
    const workingToday = eventData.filter(e => e.start && e.end && !isOut(e.name) && !hasRole(e.name));

    return workingToday.filter(e => !(peopleOut.includes(e.name + ' (OUT)')));
}