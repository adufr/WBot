const {
    Inhibitor
} = require('klasa');

module.exports = class extends Inhibitor {

    constructor(...args) {
        super(...args, {
            name: "commandLogger",
            enabled: true,
            spamProtection: false
        });
    }

    async run(msg, cmd) {
        this.client.logger.verbose(`${msg.author.tag} ran cmd: ${cmd.name}, on "${msg.guild.name}" (${msg.guild.id})`);
    }

};
