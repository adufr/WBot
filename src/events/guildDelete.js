/**
 * Code appelé lors que l'event "guildDelete" est triggered :
 * (dès que le bot rejoinds un serveur)
 */
module.exports = (wbot, guild) => {
  wbot.database.query(`SELECT serveur_discord_id FROM serveur WHERE serveur_discord_id = '${guild.id}'`, function (err, rows, fields) {
    if (err) wbot.logger.log(err, 'error')

    /**
     * Si le bot n'a jamais rejoins le serveur
     * on l'insère dans la bdd
     */
    if (rows.length <= 0) {
      wbot.database.query(`INSERT INTO serveur (serveur_discord_id, serveur_nom, serveur_date_join) VALUES ('${guild.id}', '${guild.name}', '0000-00-00 00:00:00')`, function (err, rows, fields) {
        if (err) wbot.logger.log(err, 'error')
        wbot.logger.log(`[${guild.name}] (${guild.owner.user.tag}) WBot LEFT the server. ID is: ${guild.id} (/!\\ Wasn't registerd)`, 'info')
      })
    /**
     * Si le bot a déjà rejoins le serveur
     * on supprime sa date de join
     */
    } else {
      wbot.database.query(`UPDATE serveur SET serveur_date_join = '0000-00-00 00:00:00' WHERE serveur_discord_id = '${guild.id}'`, function (err, rows, fields) {
        if (err) wbot.logger.log(err, 'error')
        wbot.logger.log(`[${guild.name}] (${guild.owner.user.tag}) WBot LEFT the server. ID is: ${guild.id}`, 'info')
      })
    }

    /**
     * Mise à jour du "message d'activité"
     * (nombre de serveurs)
     */
    wbot.user.setActivity(`!help - ${wbot.guilds.size} serveurs`, {
      type: 'WATCHING'
    })
  })
}
