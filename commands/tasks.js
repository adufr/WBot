const {
    Command
} = require("klasa");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            runIn: ["text"],
            cooldown: 10,
            permissionLevel: 0,
            aliases: ["devoir", "d"],
            requiredPermissions: ["USE_EXTERNAL_EMOJIS"],
            description: "Affiche les devoirs",
        });
    }

    async run(msg, user) {
        msg.channel.send(`Devoirs : `);
    }

};
