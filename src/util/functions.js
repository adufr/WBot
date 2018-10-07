// ===========================================================
// == Chargement des modules
// ===========================================================

const Discord = require('discord.js')
const moment = require('moment')



// ===========================================================
// == Fonction
// ===========================================================

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
      wbot.database.query(`SELECT * FROM devoir, serveur WHERE serveur_discord_id = '${message.guild.id}' AND devoir_date >= CURDATE() ORDER BY devoir_date`, function (err, rows, fields) {
        if (err) reject(err)
        if (rows[0] === undefined) {
          var embedempty = new Discord.RichEmbed()
            .setColor(4886754)
            .setTimestamp()
            .setFooter('WBot', wbot.user.avatarURL)
            .setAuthor('WBot', wbot.user.avatarURL)
            .addField('Il n\'y a aucun devoir à venir ...', 'Pour ajouter un devoir, veuillez exécuter la commande `!devoirs_add` ou vous référer à l\'aide avec la commande `!help devoirs_add`.')
          resolve(embedempty)
        } else {
        // Début construction de l'embed
          var embed = new Discord.RichEmbed()
            .setColor(4886754)
            .setTimestamp()
            .setFooter('WBot', wbot.user.avatarURL)
            .setAuthor('WBot', wbot.user.avatarURL)

          // Loop dans les devoirs

          // Verifie si la date du devoir est aujourd'hui
          // Si oui, cela va afficher Aujourd'hui dans l'affichage des devoirs
          var aujourdhui = new Date(Date.now())
          aujourdhui = moment(aujourdhui).format('DD/MM/YY')

          // Verifie si la date du devoir est demain
          // Si oui, cela va afficher Demain dans l'affichage des devoirs
          var currentDate = new Date()
          var demain = currentDate.setDate(currentDate.getDate() + 1)
          demain = moment(demain).format('DD/MM/YY')
          var datePassage
          rows.forEach(function (row) {
            let date = moment(row.devoir_date).format('DD/MM/YY')
            let weekday = moment(row.devoir_date).isoWeekday()

            // Si la date est la même que le champ d'avant : on rajoute au field
            if (datePassage !== undefined && datePassage === date) {
              embed.fields[embed.fields.length - 1].value += '\n**`' + beautify(row.devoir_matiere) + '`** - ' + row.devoir_contenu

              // Sinon, on rajoute un field (bloc)
            } else if (date === aujourdhui) {
              embed.addField('Aujourd\'hui' + ' :', '**`' + beautify(row.devoir_matiere) + '`** - ' + row.devoir_contenu)
            } else if (date === demain) {
              embed.addField('Demain' + ' :', '**`' + beautify(row.devoir_matiere) + '`** - ' + row.devoir_contenu)
            } else {
              embed.addField(formatDate(date, weekday) + ' :', '**`' + beautify(row.devoir_matiere) + '`** - ' + row.devoir_contenu)
            }

            datePassage = date
          })
          resolve(embed)
        }
      })
    })
  }



  /**
   * Met à jour le channel contenant les devoirs
   * (supprime le dernier message envoyé par le bot,
   * puis reposte le message actualisé)
   */
  wbot.updateDevoirsChannel = (message) => {
    // Update des notifications
    wbot.notifyAllServers()
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
   * Appel pour lancer les notifications
   */
  wbot.notifyAllServers = () => {
    wbot.database.query(`SELECT serveur_discord_id, serveur_channel_notif, serveur_id FROM serveur`, function (err, rows, fields) {
      if (err) wbot.logger.log(err, 'error')
      if (rows[0] === undefined) {
        return
      }
      rows.forEach(function (row) {
        wbot.notify(row.serveur_id, row.serveur_channel_notif)
      })
    })
  }



  /**
  * Système de notifications
  */
  wbot.notify = (serveurId, channelName) => {
    // Récupération des devoirs pour le lendemain
    wbot.database.query(`SELECT DISTINCT devoir_matiere, devoir_contenu, devoir_date FROM devoir, serveur WHERE devoir.serveur_id = '${serveurId}' AND devoir_date = CURDATE() + interval 1 day ORDER BY devoir_date`, function (err, rows, fields) {
      if (err) wbot.logger.log(err, 'error')
      // Si il n'y en n'a pas : return
      if (rows === undefined || rows.length === 0) {
        return
      }

      // Calcul du temps à attendre avant de lancer les notifications
      const now = new Date()
      var millisTill10 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 50, 0, 0) - now
      if (millisTill10 < 0) {
        millisTill10 += 86400000 // it's after 10am, try 10am tomorrow.
      }
      // Lancement notification
      setTimeout(function () {
        var messageNotif = '**Rappel pour demain : **'
        // Pour chaque devoir : on formate le message
        rows.forEach(function (row) {
          messageNotif += '\n' + '**`' + beautify(row.devoir_matiere) + '`** - ' + row.devoir_contenu
        })
        // wbot.guilds.get(serveurId).channels.get(val => val.name === channelName).send(messageNotif)
        wbot.channels.get(channelName).send(messageNotif)
      }, millisTill10)
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



// ===========================================================
// == Autres petites fonctions
// == (uniquement accessible dans ce fichier)
// ===========================================================

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

