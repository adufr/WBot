/**
 * Classe permettant de log de manière custom (avec timestamp)
 * les messages dans la console du serveur (serveur physique),
 * notamment en faisant la différenciation entre messages de
 * debug, erreurs, avertissements etc...
 */


// ===========================================================
// == Chargement des modules
// ===========================================================

const chalk = require('chalk')
const moment = require('moment')
const fs = require('fs')


/**
 * Fonctions customs de logging
 */
exports.log = (content, type = 'info') => {
  // Variables
  const timestamp = `[${moment().format('DD-MM-YYYY HH:mm:ss')}]`

  switch (type) {
    // Log par défaut : affiche une information
    case 'info':
      return console.log(`${timestamp} (${chalk.bgBlue(type.toUpperCase())}...) ${content}`)


    // Log un message succès
    case 'success':
      return console.log(`${timestamp} (${chalk.black.bgGreen(type.toUpperCase())}) ${content}`)


    // Log un message de warning
    case 'warn':
      return console.log(`${timestamp} (${chalk.black.bgYellow(type.toUpperCase())}...) ${content}`)


    // Log une erreur 'fatale'
    case 'error':
      let log = timestamp + ' (' + type.toUpperCase() + '..) ' + content + '\n'
      fs.appendFile('logs/log.txt', log, 'utf8', (err) => {
        if (err) throw err
      })
      return console.log(`${timestamp} (${chalk.bgRed(type.toUpperCase())}..) ${content}`)


    // Type non reconnu, envoie d'un message d'erreur
    default:
      throw new TypeError('Le type de logger doit être : success, warn ou error.')
  }
}



// Exportation des méthodes
exports.success = (...args) => this.log(...args, 'success')
exports.warn = (...args) => this.log(...args, 'warn')
exports.error = (...args) => this.log(...args, 'error')
