const CalendarBotClient = require("./lib/CalendarBotClient");
const config = require("./config")

const client = new CalendarBotClient({
    production: config.production,
    language: config.language,
    prefix: config.prefix,
    ownerID: config.ownerID,
    typing: config.typing,
    noPrefixDM: false,
    prefixCaseInsensitive: false,
    commandEditing: config.commandEditing,
    commandLogging: config.commandLogging,
    disabledEvents: [
        "GUILD_SYNC",
        "CHANNEL_PINS_UPDATE",
        "USER_NOTE_UPDATE",
        "RELATIONSHIP_ADD",
        "RELATIONSHIP_REMOVE",
        "USER_SETTINGS_UPDATE",
        "VOICE_STATE_UPDATE",
        "VOICE_SERVER_UPDATE",
        "TYPING_START",
        "PRESENCE_UPDATE"
    ],
    pieceDefaults: {
        commands: {
            deletable: true,
            quotedStringSupport: true,
            bucket: 2
        }
    },
    console: {
        useColor: config.console_use_color
    },
    presence: {
        activity: {
            name: config.activity_name,
            type: config.activity_type
        }
    }
});

client.login(config.token)
