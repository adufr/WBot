const {
    Command
} = require("klasa");

module.exports = class extends Command {


    constructor(...args) {
        super(...args, {
            name: "addtask",
            description: "Rajoute une tâche",
            extendedHelp: "Aucune aide complémentaire disponible.",
            cooldown: 5,
            permissionLevel: 0,
            aliases: ["addtasks", "addtask", "add", "at"],
            runIn: ["text"],
            usage: "<titre:string> <due_date:string> <description:string>  [...]",
            usageDelim: " "
        });
        this.usageCustom = "%addtask <titre:string> <due_date:string> <description:string>";
        this.example = "%addtask Maths 28/10/18 Faire l'exercice 69 de la page 420.";
    }

    async run(message, [titre, due_date, ...description]) {
        const task = {
            title: titre,
            due_date: due_date,
            description: description.join(" ")
        };
        await message.guild.settings.update("tasklist.tasks", task);
        return message.reply(`votre tâche : **${titre}**, pour le **${due_date}** a bien été ajoutée ! :white_check_mark:`);
    }

}