/**
 * Vérifie la version de node avec laquelle le programme est executé
 * (Si < 8.0.0 -> le programme se ferme)
 */
if (process.version.slice(1).split('.')[0] < 8) throw new Error('Node 8.0.0 or higher is required. Update Node on your system.')



// ===========================================================
// == Chargement des modules
// ===========================================================

const Discord = require('discord.js')
const mysql = require('mysql')

const bufferUtil = require('bufferutil')
const crypto = require('crypto')
const source = crypto.randomBytes(10)
const mask = crypto.randomBytes(4)
bufferUtil.mask(source, mask, source, 0, source.length)

const {
  promisify
} = require('util')
const fs = require('fs')
const readdir = promisify(require('fs').readdir)
const path = require('path')
const packageJson = require('../package.json')



// ===========================================================
// == Initialisation du bot
// ===========================================================

const wbot = new Discord.Client()
wbot.commands = new Discord.Collection()



// ===========================================================
// == Chargement de divers modules
// ===========================================================

/**
 * Chargement de divers fichiers
 */
const token = require('./config/token.js') // token bot & bdd
require('./util/functions.js')(wbot) // fonctions utiles


/**
 * Chargement du logger custom
 */
wbot.logger = require('./util/logger')
wbot.errors = require('./util/errors.js')


/**
 * Création de la connexion à la bdd
 */
wbot.database = mysql.createConnection({
  host: token.db_host,
  user: token.db_user,
  password: token.db_password,
  database: token.db_database,
  charset: 'utf8mb4'
})



// ===========================================================
// == LANCEMENT DU BOT
// ===========================================================

const init = async () => {
  // Début du chargement :
  wbot.logger.log('================================================================', 'info')
  wbot.logger.log('Début du chargement...', 'info')
  wbot.logger.log('Version ' + packageJson.version, 'info')
  wbot.logger.log('================================================================', 'info')


  // Établissement de la connexion bdd :
  wbot.database.connect(err => {
    if (err) {
      wbot.logger.log('Une erreur est survenue lors de la connexion à la bdd (' + err + ')', 'error')
      throw err
    }
    wbot.logger.log('Connexion à la bdd réussie', 'success')
  })


  // Chargement des commandes :
  wbot.logger.log('================================================================', 'info')
  wbot.logger.log('Début du chargement des commandes...', 'info')
  loadCommands(path.join(__dirname, '/commands/user/'))
  loadCommands(path.join(__dirname, '/commands/admin/'))



  // Chargement des évenements  :
  var eventFiles = await readdir(path.join(__dirname, '/events/'))

  wbot.logger.log('================================================================', 'info')
  wbot.logger.log(`Chargement d'un total de ${eventFiles.length} événements :`, 'info')

  // Pour chaque fichier event
  eventFiles.forEach(file => {
    // Récupère l'event
    const eventName = file.split('.')[0]
    const event = require(`./events/${file}`)

    // Bind l'event
    wbot.on(eventName, event.bind(null, wbot))

    // Chargement de l'event
    const mod = require.cache[require.resolve(`./events/${file}`)]
    delete require.cache[require.resolve(`./events/${file}`)]
    for (let i = 0; i < mod.parent.children.length; i++) {
      if (mod.parent.children[i] === mod) {
        mod.parent.children.splice(i, 1)
        wbot.logger.log(`  -- événement ${file} chargé`, 'success')
        break
      }
    }
  })
  wbot.logger.log('================================================================', 'info')


  // Une fois que tout est bien chargé : on lance le bot!
  wbot.login(token.bot_token)
}



// ===========================================================
// == LANCEMENT DE LA FONCTION DEMARRAGE DU BOT
// ===========================================================

init()



// ===========================================================
// == Autres fonctions
// ===========================================================

/**
 * Fonction permettant le chargement des commandes
 * (loop à travers les dossiers)
 */
function loadCommands (commandsPath) {
  fs.readdir(commandsPath, (err, files) => { // boucle sur tout les fichiers du dossier
    if (err) wbot.logger.log(err, 'error')

    let jsFile = files.filter(f => f.split('.').pop() === 'js') // Nombre de fichiers .js
    wbot.logger.log(commandsPath.slice(-15) + ':', 'info') // affiche dans quel dossier on est entrain de charger la cmd

    // Si on ne trouve pas de commandes
    if (jsFile.length <= 0) {
      wbot.logger.log('  0 commandes trouvées...', 'warn')
      return
    }

    // Chargement des commandes trouvées
    wbot.logger.log('  ' + jsFile.length + ' commandes trouvées :', 'info') // affiche nombre commandes

    // Pour chaque commande
    jsFile.forEach((f, i) => {
      let props = require(`${commandsPath}${f}`)
      wbot.logger.log(`  -- commande ${f} chargée`, 'success')
      wbot.commands.set(props.help.name, props)

      // Si la cmd possède des alias, on les charge
      if (props.help.aliases.length > 0) {
        props.help.aliases.forEach(function (alias) {
          wbot.commands.set(alias, props)
        })
      }
    })
  })
}
