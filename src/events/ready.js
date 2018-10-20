/**
 * Code appelé lors que l'event "ready" est triggered :
 * (log du bon démarrage)
 */
module.exports = async wbot => {
  // Log le fait que le bot s'est connecté avec succès + quelques stats
  wbot.logger.log(`==> ${wbot.user.tag} is up and running!`, 'success')
  wbot.logger.log(`==> ${wbot.user.tag} is on ${wbot.guilds.size} guilds, serving ${wbot.users.size} users!`, 'success')

  // Set message d'activité :
  wbot.user.setActivity(`!help - ${wbot.guilds.size} serveurs`, {
    type: 'WATCHING'
  })

  // Lancement des mises à jour des devoirs & notifications
  wbot.dailyUpdate()
}
