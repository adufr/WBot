// ===========================================================
// == Execution de la commande
// ===========================================================

/**
 * Commande notify :
 * (ajoute/supprime le rôle notifications de devoirs à la
 * personne qui effectue la commande)
 */
module.exports.run = async (wbot, message, args) => {
  /**
   * Vérification existence du rôle
   */
  const role = message.guild.roles.find(val => val.name === 'notif_devoirs')
  if (role == null || !message.guild.roles.has(role.id)) {
    wbot.errors.roleNotFound(wbot, message, 'notif_devoirs')
    return
  }

  /**
   * Si l'auteur a déjà le rôle --> on lui retire
   * Sinon --> on lui ajoute
   */
  if (message.member.roles.find(val => val.id === role.id === true)) {
    message.member.removeRole(role)
    wbot.sendSuccess(message, 'Vous **ne recevrez plus** de notifications.')
  } else {
    message.member.addRole(role)
    wbot.sendSuccess(message, 'Vous **serez notifié** des devoirs à faire à J-1.')
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
  aliases: ['notif', 'n'],
  name: 'notify',
  shortDesc: 'Vous permet de recevoir des notificationsl la veille',
  longDesc: 'La commande notify vous permet d\'obtenir / de vous retirer le rôle "notif_devoirs". Lorsque vous possédez ce rôle, vous recevrez une notifications à 18h30 la veille de chaque jour où des devoirs sont enregistrés.',
  usage: 'notify',
  example: 'notify'
}
