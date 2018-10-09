// ===========================================================
// == Execution de la commande
// ===========================================================

/**
 * Commande devoirs :
 * affiche les devoirs à
 * faire en fonction du serveur
 */
module.exports.run = async (wbot, message, args) => {
  Promise.all([
    wbot.getEmbedDevoirsByMessage(message)
  ]).then(function (response) {
    wbot.database.query(`SELECT serveur_channel_name FROM serveur WHERE serveur_discord_id = '${message.guild.id}'`, function (err, rows, fields) {
      if (err) wbot.logger.log(err, 'error')
      message.channel.send(response[0])
    })
  })
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
  aliases: ['dev', 'd'],
  name: 'devoirs',
  shortDesc: 'Affiche la liste des des devoirs à venir',
  longDesc: 'Cette commande permet d\'afficher les devoirs à venir dans l\'ordre croissant. Pour ajouter un devoir, veuillez effectuer la commande `!adddevoir`.',
  usage: 'devoirs',
  example: 'devoirs'
}
