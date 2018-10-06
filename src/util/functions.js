// ===========================================================
// == Chargement des modules
// ===========================================================

const Discord = require('discord.js')
const moment = require('moment')



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
    return new Promise(function (resolve, reject) {
      wbot.database.query(`SELECT * FROM devoir, serveur WHERE serveur_discord_id = '${message.guild.id}' ORDER BY devoir_date`, function (err, rows, fields) {
        if (err) reject(err)

        // Début construction de l'embed
        var embed = new Discord.RichEmbed()
          .setColor(4886754)
          .setTimestamp()
          .setFooter('WBot', wbot.user.avatarURL)
          .setAuthor('WBot', wbot.user.avatarURL)

        // Loop dans les devoirs
        var datePassage
        rows.forEach(function (row) {
          let date = moment(row.devoir_date).format('DD/MM/YY')
          let weekday = moment(row.devoir_date).isoWeekday()

          // Si la date est la même que le champ d'avant : on rajoute au field
          if (datePassage !== undefined && datePassage === date) {
            embed.fields[embed.fields.length - 1].value += '\n**`' + beautify(row.devoir_matiere) + '`** - ' + row.devoir_contenu

            // Sinon, on rajoute un field (bloc)
          } else {
            embed.addField(formatDate(date, weekday) + ' :', '**`' + beautify(row.devoir_matiere) + '`** - ' + row.devoir_contenu)
          }

          datePassage = date
        })
        resolve(embed)
      })
    })
  }


  /**
   * Met à jour le channel contenant les devoirs
   * (supprime le dernier message envoyé par le bot,
   * puis reposte le message actualisé)
   */
  wbot.updateDevoirsChannel = (message) => {
    // Récupération du channel
    wbot.database.query(`SELECT serveur_channel_name FROM serveur WHERE serveur_discord_id = '${message.guild.id}'`, function (err, rows, fields) {
      if (err) wbot.logger.log(err, 'error')

      /**
       * Si le channel n'existe pas
       */
      if (message.guild.channels.some(val => val.name === rows[0].serveur_channel_name) === false) {
        wbot.errors.channelNotFound(wbot, message, rows[0].serveur_channel_name)
        return
      }

      /**
       * Suppression du dernier message du bot
       */
      message.guild.channels.find(val => val.name === rows[0].serveur_channel_name).fetchMessages()
        .then(function (msgs) {
          msgs.filter(m => m.author.id === wbot.user.id)
          if (msgs.size) msgs.first().delete()
          Promise.all([
            wbot.getEmbedDevoirs(message)
          ]).then(function (response) {
            message.guild.channels.find(val => val.name === rows[0].serveur_channel_name).send(response[0])
          })
        })
    })
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


/**
 * Fonction permettant d'aligner le texte
 */
function beautify (s) {
  if (s.length < 14) {
    for (let i = 0; i < 14; i++) {
      if (s.length < 14) s += '.'
    }
  }
  return s
}


/**
 * Formate la date et renvoie un string
 */
function formatDate (date, weekday) {
  // date = '10/10'
  let temp = date.split('/')

  var jour = ''
  switch (weekday) {
    case 1:
      jour = 'Lundi'
      break
    case 2:
      jour = 'Mardi'
      break
    case 3:
      jour = 'Mercredi'
      break
    case 4:
      jour = 'Jeudi'
      break
    case 5:
      jour = 'Vendredi'
      break
    case 6:
      jour = 'Samedi'
      break
    case 7:
      jour = 'Dimanche'
      break
  }

  var mois = ''
  switch (temp[1]) {
    case '01':
      mois = 'Janvier'
      break
    case '02':
      mois = 'Février'
      break
    case '03':
      mois = 'Mars'
      break
    case '04':
      mois = 'Avril'
      break
    case '05':
      mois = 'Mai'
      break
    case '06':
      mois = 'Juin'
      break
    case '07':
      mois = 'Juillet'
      break
    case '08':
      mois = 'Août'
      break
    case '09':
      mois = 'Septembre'
      break
    case '10':
      mois = 'Octobre'
      break
    case '11':
      mois = 'Novembre'
      break
    case '12':
      mois = 'Décembre'
      break
  }

  return jour + ' ' + temp[0] + ' ' + mois
}

