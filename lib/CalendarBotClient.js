const {
    Client
} = require("klasa");
const config = require("../config");

//Plugins
Client.use(require("klasa-member-gateway"));

// Custom
const funcs = require("./funcs");
const permissionLevels = require('./permissionLevels');
// const logger = require("./logger");

// Schemas
const defaultGuildSchema = require(`./schemas/defaultGuildSchema`);

class CalendarBotClient extends Client {
    constructor(options) {
        super({ ...options,
            permissionLevels,
            defaultGuildSchema
        });
        this.funcs = funcs;
        this.config = config;
        // this.logger = logger;
    }

}

module.exports = CalendarBotClient;
