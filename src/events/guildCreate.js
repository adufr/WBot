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
        wbot.logger.log(`WBot a rejoint ${guild.name} (${guild.id}). Son créateur est ${guild.owner.user.tag}`, 'info')
      })
    /**
     * Si le bot a déjà rejoins le serveur
     * on update la date de join
     */
    } else {
      let date = moment().format('YYYY-MM-DD HH:mm:ss')
      wbot.database.query(`UPDATE serveur SET serveur_date_join = '${date}' WHERE serveur_discord_id = '${guild.id}'`, function (err, rows, fields) {
        if (err) wbot.logger.log(err, 'error')
        wbot.logger.log(`WBot a de nouveau rejoint ${guild.name} (${guild.id}). Créateur => ${guild.owner.user.tag}`, 'info')
      })
    }
  })
}
