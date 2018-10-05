// ===========================================================
// == Chargement des modules
// ===========================================================

const Discord = require('discord.js')



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
    .setTitle('Lien du Github : ')
    .setDescription('https://github.com/Woosy/bot-devoirs')
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
  aliases: ['src', 'github'],
  name: 'source',
  shortDesc: 'Affiche le lien du Github du Bot',
  longDesc: 'Ce projet est open-source. Vous pouvez retrouver l\'intégralité de son code source sur la page Github. N\'hésitez pas à contribuer en apportant des idées d\'améliorations, oubien en signalant les bugs.',
  usage: 'source',
  example: 'source'
}
