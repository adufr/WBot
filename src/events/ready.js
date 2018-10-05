/**
 * Code appelé lors que l'event "ready" est triggered :
 * (log du bon démarrage)
 */
module.exports = async wbot => {
  // Log le fait que le bot s'est connecté avec succès + quelques stats
  wbot.logger.log(`${wbot.user.tag} a démarré avec succès !`, 'success')
  wbot.logger.log(`WBot est sur ${wbot.guilds.size} serveurs (${wbot.users.size} utilisateurs)`, 'success')

  // Set message d'activité :
  wbot.user.setActivity('Tapez !help', {
    type: 'WATCHING'
  })
}
