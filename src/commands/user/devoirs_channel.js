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


  // Insértion du nouveau channel
  wbot.database.query(`UPDATE serveur SET serveur_channel_devoirs = '${args[0]}' WHERE serveur_discord_id = '${message.guild.id}'`, function (err, rows, fields) {
    if (err) wbot.logger.log(err, 'error')

    // Message de succès
    wbot.sendSuccess(message, 'Les devoirs s\'afficheront désormais dans le channel : **' + args[0] + '**')
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
  aliases: ['dev_channel', 'd_chan', 'dev_c', 'dc'],
  name: 'devoirs_channel',
  shortDesc: 'Défini le channel où lister les devoirs',
  longDesc: 'Cette commande permet d\'afficher les devoirs à venir dans l\'ordre croissant. Pour ajouter un devoir, veuillez effectuer la commande `!adddevoir`.',
  usage: 'devoirs_channel <nomDuChannel>',
  example: 'devoirs_channel devoirs'
}
