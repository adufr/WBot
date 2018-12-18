const {
    Argument
} = require('klasa');
const moment = require('moment');

module.exports = class extends Argument {

    run(arg, possible, message) {
        var date = moment(arg, "DD/MM/YY");
        date = date.toDate();
        if (date && !isNaN(date.getTime()) && date.getTime() > Date.now()) return date;
        else throw `<@${message.author.id}>, la date indiquée n'est pas valide !`;
    }

};