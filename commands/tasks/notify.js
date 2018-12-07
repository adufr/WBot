const {
    Command
} = require("klasa");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: "notify",
            description: "Recevoir une notification avant qu'une tâche arrive à expiration",
            extendedHelp: "Aucune aide complémentaire disponible.",
            cooldown: 5,
            permissionLevel: 0,
            aliases: ["notification", "notifs", "notif"],
            runIn: ["text"],
        });
        this.usageCustom = "%notify";
        this.example = "%notif";
    }

    async run(message) {
        if (!message.guild) return;

        const guild = message.guild;
        var role = await guild.roles.find(role => role.name === "calendarbot_notify" === true);
        if (role == null || !guild.roles.has(role.id)) {
            // Création du rôle
            await guild.roles.create({
                data: {
                    name: "calendarbot_notify",
                    mentionable: true
                }
            }).then((result) => {
                // Attribution
                return updateRole(message, message.member, result.id);
            }).catch((err) => {
                this.client.console.error(err);
                return message.reply("une erreur est survenue...\nSi cela persiste, rejoignez le discord de support ! discord.gg/ff4f52s");
            });
        } else {
            // Attribution
            return updateRole(message, message.member, role);
        }

    }

}

/**
 * Met à jour le rôle de l'utilisateur
 */
function updateRole(message, member, role) {
    // Si le membre a déjà le rôle
    if (message.member.roles.find(val => val.id === role.id)) {
        message.member.roles.remove(role);
        return message.reply("vous **ne recevrez plus** de notifications. :white_check_mark:");
    } else {
        message.member.roles.add(role);
        return message.reply("vous **serez notifié** des devoirs à faire à J-1. :white_check_mark:");
    }
}
