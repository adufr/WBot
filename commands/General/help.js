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
            name: "help",
            cooldown: 5,
            permissionLevel: 0,
            aliases: ["commandes", "commands", "commande", "cmds", "cmd", "aides", "aide", "h"],
            runIn: ["text", "dm"],
            description: "Affiche la liste des commandes du bot",
            extendedHelp: "La commande help supporte 1 argument facultatif. Si aucun argument n'est renseigné, le bot renverra la liste complète des commandes disponibles. Sinon, si l'argument est une commande (ou un alias), vous obtiendrez la description complète de la commande."
        });
        this.usageCustom = "%help <command>";
        this.example = "%help task";
    }

    async run(message) {

        // Récupération des arguments
        const args = message.content.split(" ");


        // Si le premier argument est une commande qui existe
        // on affiche l'aide de cette commande :
        if (this.client.commands.get(args[1])) {
            // Récupération objet commande
            const cmd = this.client.commands.get(args[1])

            const embed = new MessageEmbed()
                .setColor("#3586ff")
                .setTitle(`Commande %${args[1]}`)
                .setDescription(cmd.extendedHelp)
                .addField("Utilisation", cmd.usageCustom, true)
                .addField("Exemple", cmd.example, true)
                .addField("Aliases", `\`${getAliases(cmd)}\``, false)
                .setFooter(message.author.username, message.author.avatarURL)
                .setTimestamp()
            return message.channel.send(embed);;
        }


        // Si il y a des arguments mais qu'ils ne constituent pas une commande valide
        if (args[1]) return message.reply(`commande **%${args[1]}** introuvable... Tapez \`%help\` pour afficher la liste des commandes.`);


        // Si il n'y a aucun argument
        // Affichage de la liste des commandes
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
            // this.client.logger.log(errors, 'error')
        })

    }

};


/**
 * Fonction qui loop sur tout les commandes
 * Renvoie une promesse string avec nom + shortDesc pour
 * former le message d'aide..
 */
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


/**
 * Fonction retournant un string avec la liste
 * des alias de la commande passée en paramètre
 * avec un minimum de mise en forme
 */
function getAliases(cmd) {
    let string = '';
    cmd.aliases.forEach(alias => {
        string += ', ' + alias;
    });
    return string.substr(2);
}
