// ===========================================================
// == Chargement des modules
// ===========================================================

const Discord = require('discord.js')
const moment = require('moment')
require('moment-duration-format')
const packageJson = require('../../../package.json')



// ===========================================================
// == Execution de la commande
// ===========================================================

/**
 * Commande stats :
 * affiche diverses informations sur le bot
 */
module.exports.run = async (wbot, message, args) => {
  // Récupération et formatage de l'uptime
  const duration = moment.duration(wbot.uptime).format(' D [jour], H [heure] et m [minute], s [s]')

  // Construction de la réponse
  const embed = new Discord.RichEmbed()
    .setColor('#3586ff')
    .setAuthor(wbot.user.username, wbot.user.avatarURL)
    .setTitle('Informations :')
    .setDescription('Liste d\'informations concernant le bot.')
    .addField('Version du bot', 'v' + packageJson.version, true)
    .addField('Version discord.js', 'v' + packageJson.dependencies['discord.js'], true)
    .addField('Version nodejs', process.version, true)
    .addField('Uptime', duration, true)
    .addField('Mem usage', (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + ' MB', true)
    .addField('Créateur', 'Arthur / Woosy#4710', true)
    .addField('Serveurs', wbot.guilds.size, true)
    .addField('Channels', wbot.channels.size, true)
    .addField('Utilisateurs', wbot.users.size, true)
    .setFooter(message.author.username, message.author.avatarURL)
    .setTimestamp()

  // Envoi
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
  aliases: ['info', 'bot'],
  name: 'stats',
  shortDesc: 'Affiche diverses informations du bot',
  longDesc: 'La commande stats vous permet d\'obtenir des informations (principalement techniques) sur le bot. Vous pouvez ainsi surveiller le fait qu\'il soit à jour, ou bien avoir une idée du nombre de personnes qui l\'utilisent...',
  usage: 'stats',
  example: 'stats'
}
