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
  wbot.getEmbedDevoirs = (type, value) => {
    return new Promise(function (resolve, reject) {
      /**
       * Id du discord permettant de récupérer
       * les devoirs
       */
      var discordId = value
      if (type === 'message') discordId = value.guild.id

      wbot.database.query(`SELECT DISTINCT devoir_matiere, devoir_date, devoir_contenu FROM devoir, serveur WHERE devoir.serveur_discord_id = '${discordId}' AND devoir_date >= CURDATE() ORDER BY devoir_date`, function (err, rows, fields) {
        if (err) reject(err)

        // Début construction de l'embed
        var embed = new Discord.RichEmbed()
          .setColor(4886754)
          .setTimestamp()
          .setAuthor('WBot', wbot.user.avatarURL)
          .setFooter('Dernière mise-à-jour', wbot.user.avatarURL)

        // PAS DE DEVOIRS :
        if (rows[0] === undefined) {
          embed.addField('Il n\'y a aucun devoir à venir ...', 'Pour ajouter un devoir, veuillez exécuter la commande `!devoirs_add` ou vous référer à l\'aide avec la commande `!help devoirs_add`.')
          resolve(embed)

          // LISTE DES DEVOIRS :
        } else {
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
    wbot.database.query(`SELECT serveur_channel_notif FROM serveur WHERE serveur_discord_id = '${message.guild.id}'`, function (err, rows, fields) {
      if (err) wbot.logger.log(err, 'error')
      wbot.notify(message.guild.id, rows[0].serveur_channel_notif)
    })
    // Récupération du channel
    wbot.database.query(`SELECT serveur_channel_devoirs FROM serveur WHERE serveur_discord_id = '${message.guild.id}'`, function (err, rows, fields) {
      if (err) wbot.logger.log(err, 'error')

      /**
       * Si le channel n'existe pas
       */
      if (message.guild.channels.some(val => val.name === rows[0].serveur_channel_devoirs) === false) {
        wbot.errors.channelNotFound(wbot, message, rows[0].serveur_channel_devoirs)
        return
      }

      /**
       * Suppression du dernier message du bot
       */
      message.guild.channels.find(val => val.name === rows[0].serveur_channel_devoirs).fetchMessages()
        .then(function (msgs) {
          msgs.filter(m => m.author.id === wbot.user.id)
          if (msgs.size) msgs.first().delete()
          Promise.all([
            wbot.getEmbedDevoirs('message', message)
          ]).then(function (response) {
            message.guild.channels.find(val => val.name === rows[0].serveur_channel_devoirs).send(response[0])
          })
        })
    })
  }



  /**
   * Mise à jour quotidienne du channel
   * contenant le message de devoirs
   */
  wbot.updateDevoirsChannelDaily = (discordId) => {
    // Update des notifications
    wbot.database.query(`SELECT serveur_channel_notif FROM serveur WHERE serveur_discord_id = '${discordId}'`, function (err, rows, fields) {
      if (err) wbot.logger.log(err, 'error')
      wbot.notify(discordId, rows[0].serveur_channel_notif)
    })
    // Update du message de devoirs
    wbot.database.query(`SELECT serveur_channel_devoirs FROM serveur WHERE serveur_discord_id = '${discordId}'`, function (err, rows, fields) {
      if (err) wbot.logger.log(err, 'error')

      /**
       * Si le channel n'existe pas
       */
      if (wbot.guilds.get(discordId).channels.some(val => val.name === rows[0].serveur_channel_devoirs) === false) return

      /**
       * Suppression du dernier message du bot
       * Puis envoie du nouveau message mis-à-jour
       */
      wbot.guilds.get(discordId).channels.find(val => val.name === rows[0].serveur_channel_devoirs).fetchMessages()
        .then(function (msgs) {
          msgs.filter(m => m.author.id === wbot.user.id)
          if (msgs.size) msgs.first().delete()
          Promise.all([
            wbot.getEmbedDevoirs('discordId', discordId)
          ]).then(function (response) {
            wbot.guilds.get(discordId).channels.find(val => val.name === rows[0].serveur_channel_devoirs).send(response[0])
          })
        })
    })
  }



  /**
   * Appel pour lancer les notifications sur tout les serveurs
   */
  wbot.notifyAllServers = () => {
    wbot.database.query(`SELECT DISTINCT serveur_discord_id, serveur_channel_notif FROM serveur`, function (err, rows, fields) {
      if (err) wbot.logger.log(err, 'error')
      if (rows[0] === undefined) return

      // Envoie notification
      rows.forEach(function (row) {
        wbot.notify(row.serveur_discord_id, row.serveur_channel_notif)
      })
    })
  }



  /**
   * Système de notifications
   */
  wbot.notify = (serveurId, channelName) => {
    // Récupération des devoirs pour le lendemain
    wbot.database.query(`SELECT DISTINCT devoir_matiere, devoir_contenu, devoir_date FROM devoir, serveur WHERE devoir.serveur_discord_id = '${serveurId}' AND devoir_date = CURDATE() + interval 1 day ORDER BY devoir_date`, function (err, rows, fields) {
      if (err) wbot.logger.log(err, 'error')
      // Si il n'y en n'a pas : return
      if (rows === undefined || rows.length === 0) return

      // Calcul du temps à attendre avant de lancer les notifications
      const now = new Date()
      var millisTill10 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 30, 0, 0) - now
      if (millisTill10 < 0) millisTill10 += 8.64e7 // 86400000 = 24h

      // Lancement compte-à-rebours notification
      setTimeout(function () {
        var messageNotif = '**Rappel pour demain : **'
        // Pour chaque devoir : on formate le message
        rows.forEach(function (row) {
          messageNotif += '\n' + '**`' + beautify(row.devoir_matiere) + '`** - ' + row.devoir_contenu
        })

        // Création et envoie de l'embed
        const embed = new Discord.RichEmbed()
          .setColor(4886754)
          .setTimestamp()
          .setFooter('WBot', wbot.user.avatarURL)
          .setAuthor('WBot', wbot.user.avatarURL)
          .setTitle('Devoirs pour demain :')
          .setDescription(messageNotif)
        wbot.channels.get(channelName).send(embed)
      }, millisTill10)
    })
  }



  /**
   * Compte à rebour pour lancer les notifications
   */
  wbot.dailyUpdate = () => {
    // Calcul du temps à attendre avant de lancer les notifications
    const now = new Date()
    var millisTill10 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 10, 0, 0) - now
    if (millisTill10 < 0) millisTill10 += 8.64e7 // 86400000 = 24h

    // Lancement compte-à-rebours avant update devoirs / notifications
    setTimeout(function () {
      wbot.database.query(`SELECT serveur_discord_id, serveur_channel_notif FROM serveur`, function (err, rows, fields) {
        if (err) wbot.logger.log(err, 'error')
        if (rows[0] === undefined) return

        // Update de chaque serveur
        rows.forEach(function (row) {
          wbot.updateDevoirsChannelDaily(row.serveur_discord_id)
        })
      })

      wbot.notifyAllServers()
      wbot.dailyUpdate()
    }, millisTill10)
  }



  /**
   * Envoi d'un message signalant le succès d'une commande
   */
  wbot.sendSuccess = (message, msg) => { // msg => la variable contenant le message de retoru
    const embed = new Discord.RichEmbed()
      .setColor('#00B200')
      .setDescription(msg)
      .setAuthor('Succès !', wbot.user.avatarURL)
      .setFooter(message.author.username, message.author.avatarURL)
      .setTimestamp()

    message.channel.send(embed)
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

