const {
    Client
} = require("klasa");
const config = require("../config");

// Custom
const funcs = require("./funcs");
const permissionLevels = require(`./permissionLevels`);

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
    }

}

module.exports = CalendarBotClient;
