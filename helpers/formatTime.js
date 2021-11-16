module.exports.formatTime = (timeString) => {
    let s = timeString.split(':');
    let amPM = s[2][s[2].length-2] + s[2][s[2].length-1];
    return s[0]+':'+s[1]+' '+amPM;
}

module.exports.getDay = () => {
    let today = new Date();
    today.setHours(today.getHours() - 7);

    let month = today.getMonth() + 1;
    if (month > 12){
        month = 12
    }
    let day = today.getDate();
    return month +'/'+ day;
}