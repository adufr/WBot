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
