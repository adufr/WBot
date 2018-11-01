// ===========================================================
// == Chargement des modules
// ===========================================================

const Discord = require('discord.js')



// ===========================================================
// == Fonctions
// ===========================================================

/**
 * Envoie de l'embed d'erreur
 */
function sendErrorEmbed (message, title, description) {
  // Création de l'embed
  const embed = new Discord.RichEmbed()
    .setColor('#ff0000') // rouge
    .setTitle(title)
    .setDescription(description)
    .setFooter(message.author.username, message.author.avatarURL)
    .setTimestamp()

  // Envoie du message
  message.channel.send(embed)
}



// ===========================================================
// == Liste des erreurs
// ===========================================================

/**
 * Commande inexistante
 */
exports.commandNotFound = (wbot, message, cmd) => {
  sendErrorEmbed(message, 'Erreur : commande introuvable', 'La commande **' + cmd + '** est introuvable.\nFaites **!help** pour obtenir la liste des commandes.')
}


/**
 * Permission insuffisante :
 */
exports.noPerm = (wbot, message) => {
  sendErrorEmbed(message, 'Erreur : permission refusée', 'Vous n\'avez pas la permission d\'effectuer cette action.')
}


/**
 * Impossible de trouver l'utilisateur
 */
exports.userNotFound = (wbot, message, user) => {
  sendErrorEmbed(message, 'Erreur : utilisateur non trouvé', 'L\'utilisateur **' + user.username + '** n\'est pas sur ce serveur...')
}


/**
 * Rôle non trouvé
 */
exports.roleNotFound = (wbot, message, role) => {
  sendErrorEmbed(message, 'Erreur : role non trouvé', 'Le role **' + role + '** n\'a pas été trouvé...')
}


/**
 * Rôle non défini
 */
exports.roleNotDef = (wbot, message, str) => {
  sendErrorEmbed(message, 'Erreur : aucun rôle défini', 'Le rôle **' + str + '** n\'est pas défini...')
}


/**
 * Channel non trouvé
 */
exports.channelNotFound = (wbot, message, channel) => {
  sendErrorEmbed(message, 'Erreur : channel non trouvé', 'Le channel **' + channel + '** n\'a pas été trouvé...')
}


/**
 * Channel non défini
 */
exports.channelNotDef = (wbot, message, str) => {
  sendErrorEmbed(message, 'Erreur : aucun channel défini', 'Le channel de **' + str + '** n\'est pas défini...')
}


/**
 * Commande max executée
 * (utilisation incorrecte)
 */
exports.errorWrongUsage = (wbot, commandName, message) => {
  const command = wbot.commands.get(commandName)
  sendErrorEmbed(message, 'Erreur : utilisation incorrecte', 'Usage : **!' + command.help.usage + '**')
}


/**
 * Argument n'est valide
 * (doit être un nombre)
 */
exports.NaN = (wbot, message) => {
  sendErrorEmbed(message, 'Erreur : NaN', 'Veuillez indiquer un **chiffre valide**.')
}


/**
 * Nombre entré invalide
 * (non compris entre le min et le max)
 */
exports.numberBetween = (wbot, message, min, max) => {
  sendErrorEmbed(message, 'Erreur : nombre invalide', 'Veuillez indiquer un chiffre **entre ' + min + ' et ' + max + '**.')
}


/**
 * Nombre d'arguments invalides
 * (non compris entre le min et le max)
 */
exports.argLengthBetween = (wbot, message, arg, min, max) => {
  sendErrorEmbed(message, 'Erreur : argument invalide', 'Veuillez indiquer **' + arg + '** entre **' + min + ' et ' + max + ' caractères**.')
}


/**
 * Commande non disponible sur le serveur sur laquelle elle a
 * été effectuée...
 */
exports.argLengthBetween = (wbot, message, arg, min, max) => {
  sendErrorEmbed(message, 'Erreur : commande indisponible', 'Cette commande n\'est pas disponible sur ce serveur...')
}


/**
 * Messages privés non supportés
 */
exports.directMessage = (wbot, message) => {
  sendErrorEmbed(message, 'Erreur : messages privés non supportés', 'Les messages privés ne sont pas supportés.\nSi vous souhaitez vous servir du WBot, vous devez l\'inviter sur un serveur.')
}
