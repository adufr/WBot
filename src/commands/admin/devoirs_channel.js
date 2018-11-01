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
  if (args.length !== 0 && args.length !== 1) {
    wbot.errors.errorWrongUsage(wbot, this.help.name, message)
    return
  }


  /**
   * 0 argument - affichage du channel
   */
  if (args.length === 0) {
    wbot.database.query(`SELECT serveur_channel_devoirs FROM serveur WHERE serveur_discord_id = '${message.guild.id}'`, function (err, rows, fields) {
      if (err) wbot.logger.log(err, 'error')

      const channelName = rows[0].serveur_channel_devoirs
      // Vérification channel set ou non-set
      if (channelName) {
        wbot.sendSuccess(message, `Le channel défini est : **#${channelName}**`)
      } else {
        wbot.errors.channelNotDef(wbot, message, 'devoirs')
      }
    })
    return
  }


  /**
   * Si le channel n'existe pas
   */
  if (message.guild.channels.some(val => val.name === args[0]) === false) {
    wbot.errors.channelNotFound(wbot, message, args[0])
    return
  }


  /**
   * 1 argument - insertion du nouveau channel
   */
  wbot.database.query(`UPDATE serveur SET serveur_channel_devoirs = '${args[0]}' WHERE serveur_discord_id = '${message.guild.id}'`, function (err, rows, fields) {
    if (err) wbot.logger.log(err, 'error')

    // Message de succès
    wbot.sendSuccess(message, `Les devoirs s'afficheront désormais dans le channel : **${args[0]}**`)
  })
}



/**
 * Niveau de permission
 */
module.exports.conf = {
  permission: 10
}



/**
 * Propriétés de la commande
 */
module.exports.help = {
  aliases: ['dev_channel', 'd_chan', 'dev_c', 'd_c', 'dc'],
  name: 'devoirs_channel',
  shortDesc: `Affiche / défini le channel où lister les devoirs`,
  longDesc: `Cette commande permet de définir le channel dans lequel les devoirs s'afficheront, ou bien le l'afficher si le channel a déjà été défifini.`,
  usage: 'devoirs_channel [nomDuChannel]',
  example: 'dc devoirs'
}
