// ===========================================================
// == Execution de la commande
// ===========================================================

/**
 * Commande version :
 * affiche la version actuelle du bot
 */
module.exports.run = async (wbot, message, args) => {
  /**
   * Update du channel de devoirs
   */
  wbot.updateDevoirsChannel(message)

  // Message de succès
  wbot.sendSuccess(message, 'Les devoirs ont bien été mis à jours !')
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
  aliases: ['up'],
  name: 'update',
  shortDesc: 'Update les devoirs avec les notifications',
  longDesc: 'Permet d\'update tout les devoirs ainsi que les notifications dans le serveur',
  usage: 'update',
  example: 'update'
}
