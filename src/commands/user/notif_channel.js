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
  /**
   * Longueur argument invalide
   */
  if (args.length !== 1) {
    wbot.errors.errorWrongUsage(wbot, this.help.name, message)
    return
  }


  /**
   * Si le channel n'existe pas
   */
  if (message.guild.channels.some(val => val.name === args[0]) === false) {
    wbot.errors.channelNotFound(wbot, message, args[0])
    return
  }


  // Récupération de l'id du channel
  const channelId = (message.guild.channels.find(val => val.name === args[0])).id

  // Insértion du nouveau channel
  wbot.database.query(`UPDATE serveur SET serveur_channel_notif = '${channelId}' WHERE serveur_discord_id = '${message.guild.id}'`, function (err, rows, fields) {
    if (err) wbot.logger.log(err, 'error')

    const embed = new Discord.RichEmbed()
      .setColor('#00B200')
      .setTitle('Succès !')
      .setDescription('Les notifications s\'afficheront désormais dans le channel : **' + args[0] + '**')
      .setFooter(message.author.username, message.author.avatarURL)
      .setTimestamp()
    message.channel.send(embed)
  })
}



/**
 * Niveau de permission
 */
module.exports.conf = {
  permission: 100
}



/**
 * Propriétés de la commande
 */
module.exports.help = {
  aliases: ['n_channel', 'notif_chan', 'n_chan', 'nc'],
  name: 'notif_channel',
  shortDesc: 'Défini le channel où envoyer les notifications de devoirs',
  longDesc: 'Cette commande permet d\'afficher les notifications des devoirs du lendemain dans le le channel que vous souhaitez.',
  usage: 'notif_channel <nomDuChannel>',
  example: 'notif_channel notifications_devoirs'
}
