module.exports.getDescription = (event = '') => {
    if (event.includes('(E)')) {
        return '-- Emergency :rotating_light: --';
    } else if (event.includes('(B)')) {
        return '-- Backup :b: --';
    } else if (event.includes('(T2)')) {
        return '-- T2 :two: --';
    } else {
        return '-- OUT --';
    }
}

module.exports.hasRole = (event = '') => {
    if (event.includes('(E)') || event.includes('(B)') || event.includes('(T2)')) {
        return true;
    } else return false;
}
