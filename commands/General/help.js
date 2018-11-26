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
            runIn: ["text"],
            cooldown: 5,
            permissionLevel: 0,
            aliases: ["commandes", "commands", "commande", "cmds", "cmd", "aides", "aide", "h"],
            description: "Affiche la liste des commandes du bot",
        });
    }

    async run(message) {

        Promise.all([
            loadCommands(this, this.client, __dirname),

        ]).then(function (responses) {
            const embed = new MessageEmbed()
                .setColor('#3586ff')
                .setTitle('Liste des commandes :')
                .setDescription('Voici la liste des commandes du bot, classées par groupe de permissions')
                .addField('Commandes utilisateurs :', responses[0])
                .setFooter(message.author.username, message.author.avatarURL)
                .setTimestamp()
            message.channel.send(embed)
        }).catch(function (errors) {
            // TODO
            message.channel.send("erreur : " + errors);
            // this.client.logger.log(errors, 'error')
        })

    }

};


function loadCommands(command, client, commandsPath) {
    return new Promise(function (resolve, reject) {
        fs.readdir(commandsPath, (err, files) => { // boucle sur tout les fichiers du dossier
            if (err) reject(err)

            let jsFiles = files.filter(f => f.split('.').pop() === 'js') // Nombre de fichiers .js

            // Si on ne trouve pas de commandes
            if (jsFiles.length <= 0) resolve('Aucune commande...')

            let description = ''
            // Pour chaque commande
            jsFiles.forEach((f, i) => {
                var command = client.commands.get(f.split('.')[0]);
                description += '`%' + client.funcs.beautify(`${command}`, 15) + '` - ' + command.description + '\n';
            })
            resolve(description)
        })
    })
}
