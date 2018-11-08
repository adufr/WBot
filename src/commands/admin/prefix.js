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
    wbot.errors.wrongUsage(wbot, this.help.name, message)
    return
  }


  // Insértion du nouveau préfixe
  wbot.database.query(`UPDATE serveur SET serveur_prefix = '${args[0]}' WHERE serveur_discord_id = '${message.guild.id}'`, function (err, rows, fields) {
    if (err) wbot.logger.log(err, 'error')

    // Message de succès
    wbot.sendSuccess(message, `Le nouveau préfixe est : **${args[0]}**`)
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
  aliases: ['p'],
  name: 'prefix',
  shortDesc: 'Change le préfixe du serveur',
  longDesc: 'Cette commande permet de changer le préfixe à utiliser pour effectuer des commandes.',
  usage: 'prefix <nouveauPrefixe>',
  example: 'prefix !'
}
