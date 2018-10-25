// ===========================================================
// == Chargement des modules
// ===========================================================

const moment = require('moment')


/**
 * Code appelé lors que l'event "guildCreate" est triggered :
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
      let date = moment().format('YYYY-MM-DD HH:mm:ss')
      wbot.database.query(`INSERT INTO serveur (serveur_discord_id, serveur_nom, serveur_date_join) VALUES ('${guild.id}', '${guild.name}', '${date}')`, function (err, rows, fields) {
        if (err) wbot.logger.log(err, 'error')
        wbot.logger.log(`[${guild.name}] (${guild.owner.user.tag}) WBot JOINED the server. ID is: ${guild.id}`, 'info')
      })
      /**
       * Si le bot a déjà rejoins le serveur
       * on update la date de join
       */
    } else {
      let date = moment().format('YYYY-MM-DD HH:mm:ss')
      wbot.database.query(`UPDATE serveur SET serveur_date_join = '${date}' WHERE serveur_discord_id = '${guild.id}'`, function (err, rows, fields) {
        if (err) wbot.logger.log(err, 'error')
        wbot.logger.log(`[${guild.name}] (${guild.owner.user.tag}) WBot RE-JOINED the server. ID is: ${guild.id}`, 'info')
      })
    }

    /**
     * Création du rôle servant aux notifications
     */
    const role = guild.roles.find(val => val.name === 'notif_devoirs')
    if (role == null || !guild.roles.has(role.id)) {
      guild.createRole({
        name: 'notif_devoirs'
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
