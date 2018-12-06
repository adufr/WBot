const fs = require('fs');
const path = require('path');
const {
    Command
} = require("klasa");
const {
    MessageEmbed
} = require("discord.js");
const Discord = require('discord.js');

module.exports = class extends Command {


    constructor(...args) {
        super(...args, {
            name: "addtask",
            cooldown: 5,
            permissionLevel: 0,
            aliases: ["addtasks", "addtask", "add", "at"],
            runIn: ["text"],
            description: "Rajoute une tâche",
            extendedHelp: "Aucune aide complémentaire disponible."
        });
        this.usageCustom = "%addtask <string:titre> <date:due_date> <string[]:description>";
        this.example = "%addtask Math 28/10/18 Faire l'exercice 69 de la page 420.";
    }

    async run(message) {
        const task = {
            title: "task",
            due_date: "date",
            description: "desc"
        };
        await message.guild.settings.update("tasklist.tasks", task);
        return message.reply("insertion effectuée");
    }

}
