// ===========================================================
// == Chargement des modules
// ===========================================================

const Discord = require('discord.js')
const packageJson = require('../../../package.json')



// ===========================================================
// == Execution de la commande
// ===========================================================

/**
 * Commande version :
 * affiche la version actuelle du bot
 */
module.exports.run = async (wbot, message, args) => {
  const embed = new Discord.RichEmbed()
    .setColor('#3586ff')
    .setTitle('Version : ' + packageJson.version)
    .setDescription('Il n\'y a actuellement aucun changelog disponible...')
    .setFooter(message.author.username, message.author.avatarURL)
    .setTimestamp()
  message.channel.send(embed)
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
  aliases: ['ver', 'v'],
  name: 'version',
  shortDesc: 'Affiche la version actuelle du bot',
  longDesc: 'La commande version ne permet actuellement que d\'obtenir la version du bot. Elle permettra cependant, dans le futur, d\'afficher le changelog (liste des changements) du bot lors de ses mises-à-jour.',
  usage: 'version',
  example: 'version'
}
