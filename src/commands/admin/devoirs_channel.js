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

      const channel = message.guild.channels.find(channel => channel.id === rows[0].serveur_channel_devoirs)
      // Vérification channel set ou non-set
      if (channel) {
        wbot.sendSuccess(message, `Le channel défini est : **#${channel.name}**`)
      } else {
        wbot.errors.channelNotDef(wbot, message, 'devoirs')
      }
    })
    return
  }


  /**
   * Si le channel n'existe pas
   */
  if (message.guild.channels.some(channel => channel.name === args[0]) === false) {
    wbot.errors.channelNotFound(wbot, message, args[0])
    return
  }


  /**
   * 1 argument - insertion du nouveau channel
   */
  // Récupération de l'id du channel
  const channel = message.guild.channels.find(channel => channel.name === args[0])
  // Insertion
  wbot.database.query(`UPDATE serveur SET serveur_channel_devoirs = '${channel.id}' WHERE serveur_discord_id = '${message.guild.id}'`, function (err, rows, fields) {
    if (err) wbot.logger.log(err, 'error')

    // Message de succès
    wbot.sendSuccess(message, `Les devoirs s'afficheront désormais dans le channel : **#${args[0]}**`)
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
