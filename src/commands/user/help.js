// ===========================================================
// == Chargement des modules
// ===========================================================

const Discord = require('discord.js')
const path = require('path')
const fs = require('fs')



// ===========================================================
// == Execution de la commande
// ===========================================================

/**
 * Commande help :
 * 0 arg - affiche la liste des commandes
 *         en fonction du niveau de permission
 * 1 arg - affiche toutes les informations
 *         de la commande spécifiée
 */
module.exports.run = async (wbot, message, args) => {
  /**
   * 0 arg - affiche la liste des commandes en fonction du niveau de permission
   */
  if (args.length === 0) {
    // Promesse pour récupérer tout les commandes AVANT d'envoyer l'embed :
    Promise.all([
      loadCommands(wbot, __dirname),
      loadCommands(wbot, path.join(__dirname, '/../admin'))

    ]).then(function (responses) {
      const embed = new Discord.RichEmbed()
        .setColor('#3586ff')
        .setTitle('Liste des commandes :')
        .setDescription('Voici la liste des commandes du bot, classées par groupe de permissions')
        .addField('Commandes utilisateurs :', responses[0])
        .addField('Commandes administrateurs :', responses[1])
        .setFooter(message.author.username, message.author.avatarURL)
        .setTimestamp()
      message.channel.send(embed)
    }).catch(function (errors) {
      wbot.logger.log(errors, 'error')
    })
  } else


  /**
   * 1 arg - affiche toutes les informations de la commande spécifiée
   */
  if (args.length === 1) {
    wbot.database.query(`SELECT serveur_prefix FROM serveur WHERE serveur_discord_id = '${message.guild.id}'`, function (err, rows, fields) {
      if (err) wbot.logger.log(err, 'error')
      const prefix = rows[0].serveur_prefix

      // Vérifie que la commande existe
      const cmd = args[0]
      if (wbot.commands.has(cmd)) {
        const command = wbot.commands.get(cmd)
        const embed = new Discord.RichEmbed()
          .setColor('#3586ff')
          .setTitle('Commande ' + prefix + command.help.name)
          .setDescription(command.help.longDesc + '\n**Rappel :** Les crochets [] ne sont pas à utiliser lors de l\'execution de la commande, ils indiquent juste la présence d\'option(s) facultative(s)...')
          .addField('Utilisation', prefix + command.help.usage, true)
          .addField('Exemple', prefix + command.help.example, true)
          .addField('Aliases', '`' + wbot.getAliases(command.help.aliases) + '`')
          .setFooter(message.author.username, message.author.avatarURL)
          .setTimestamp()
        message.channel.send(embed)
      } else {
        wbot.errors.commandNotFound(wbot, message, args[0])
      }
    })
  } else {
    /**
     * Trop d'arguments -> erreur
     */
    const name = this.help.name
    wbot.database.query(`SELECT serveur_prefix FROM serveur WHERE serveur_discord_id = '${message.guild.id}'`, function (err, rows, fields) {
      if (err) wbot.logger.log(err, 'error')
      const prefix = rows[0].prefix
      const command = wbot.commands.get(name)
      wbot.errors.errorWrongUsage(wbot, prefix, command, message)
    })
  }
}



/**
 * Niveau de permission
 */
module.exports.conf = {
  permission: 0
}



/**
 * Propriétés de la commande
 */
module.exports.help = {
  aliases: ['commandes', 'commands', 'aide', 'halp', 'h'],
  name: 'help',
  shortDesc: 'Affiche aide du bot (ou de la commande)',
  longDesc: 'La commande help supporte 1 argument facultatif. Si aucun argument n\'est renseigné, le bot renverra la liste complète des commandes disponibles. Sinon, si l\'argument est une commande (ou un alias), vous obtiendrez la description complète de la commande.\n',
  usage: 'help [commande]',
  example: 'help prefix'
}



// ===========================================================
// == Autres fonctions
// ===========================================================

/**
 * Alignement des éléments
 */
function beautify (s) {
  if (s.length < 22) {
    for (let i = 0; i < 22; i++) {
      if (s.length < 22) s += '.'
    }
  }
  return s
}


/**
 * Fonction async retournant une promesse avec la liste de toutes
 * les commandes et leur short-desc
 */

function loadCommands (wbot, commandsPath) {
  return new Promise(function (resolve, reject) {
    fs.readdir(commandsPath, (err, files) => { // boucle sur tout les fichiers du dossier
      if (err) reject(err)

      let jsFile = files.filter(f => f.split('.').pop() === 'js') // Nombre de fichiers .js

      // Si on ne trouve pas de commandes
      if (jsFile.length <= 0) resolve('Aucune commande...')

      let description = ''
      // Pour chaque commande
      jsFile.forEach((f, i) => {
        const props = require(`${commandsPath}/${f}`)
        description += '`!' + beautify(props.help.name) + '` - ' + props.help.shortDesc + '\n'
      })
      resolve(description)
    })
  })
}
