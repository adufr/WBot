const moment = require('moment');
const chalk = require('chalk');
const rfs = require('rotating-file-stream');
const fs = require('fs');
const path = require('path');

exports.log = (message, type = "") => {
    const timestamp = `[${moment().format("DD-MM-YYYY HH:mm:ss")}]`;

    switch (type) {
        case "verbose":
            log = `${timestamp} (${type.toUpperCase()}) ${message}\n`;
            writeLog("../logs/access.log", log);
            return console.log(`${timestamp} (${type.toUpperCase()}) ${message}`);
        case "success":
            log = `${timestamp} (${type.toUpperCase()}) ${message}\n`;
            writeLog("../logs/access.log", log);
            return console.log(`${timestamp} (${chalk.black.bgGreen(type.toUpperCase())}) ${message}`);
        case "warn":
            log = `${timestamp} (${type.toUpperCase()}...) ${message}\n`;
            writeLog("../logs/access.log", log);
            return console.log(`${timestamp} (${chalk.black.bgYellow(type.toUpperCase())}) ${message}`);
        case "error":
            log = `${timestamp} (${type.toUpperCase()}..) ${message}\n`;
            writeLog("../logs/errors.log", log);
            return console.log(`${timestamp} (${chalk.bgRed(type.toUpperCase())}) ${message}`);
        default:
            break;
    }

}


/**
 * Écrit le log dans un fichier
 */
function writeLog(logPath, message) {
    fs.appendFile(path.join(__dirname, logPath), message, 'utf8', (err) => {
        if (err) throw err;
    });
}



/**
 * Exportation de méthodes de racourcis
 */
exports.verbose = (...args) => this.log(...args, "verbose");
exports.success = (...args) => this.log(...args, "success");
exports.warn = (...args) => this.log(...args, "warn");
exports.error = (...args) => this.log(...args, "error");
