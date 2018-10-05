// ===========================================================
// == Chargement des modules
// ===========================================================

const Discord = require('discord.js')



module.exports = (wbot) => {
  /**
   * Renvoie un string contenant tout les aliases de la commande :
   */
  wbot.getAliases = (aliases) => {
    let string = ''
    aliases.forEach(function (element) {
      string += ', ' + element
    })
    return string.substr(2)
  }


  /**
   * Fonction qui retourne l'embed avec la liste
   * des devoris en fonction du serveur sur lequel
   * la demande a été effectuée
   */
  wbot.getEmbedDevoirs = (message) => {
    wbot.database.query(`SELECT * FROM devoir, serveur WHERE serveur_discord_id = '${message.guild.id}' ORDER BY devoir_date`, function (err, rows, fields) {
      if (err) wbot.Logger.Log(err, 'error')

      // Début construction de l'embed
      let embed = new Discord.RichEmbed()
        .setColor(4886754)
        .setTimestamp()
        .setFooter('WBot', wbot.user.avatarURL)
        .setAuthor('WBot', wbot.user.avatarURL)
        .addField('Test titre', 'test description')

      // Loop dans les devoirs
      rows.forEach(function (row) {
        let devoirDate = row.devoirDate
        devoirDate = beautify(devoirDate)

        embed.addField(`${devoirDate}`, `\`**${row.devoir_matiere} :\`** ${row.devoir_contenu}`)
      })

      return embed
    })
  }

  function beautify (s) {
    if (s.length < 18) {
      for (let i = 0; i < 18; i++) {
        if (s.length < 18) s += '.'
      }
    }
    return s
  }

  /**
   * Ces deux méthodes vont catch les exceptions et 'donner plus de détails' sur les
   * erreurs et leurs stack trace (bien qu'elles laisseront le code planter au
   * cas où...)
   */
  process.on('uncaughtException', (err) => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, 'g'), './')
    wbot.logger.log(`Uncaught Exception: ${errorMsg}`, 'error')
    process.exit(1)
  })

  process.on('unhandledRejection', err => {
    wbot.logger.log(`Unhandled rejection: ${err}`, 'error')
  })
}
