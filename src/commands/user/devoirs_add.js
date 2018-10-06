// ===========================================================
// == Chargement des modules
// ===========================================================

const Discord = require('discord.js')



// ===========================================================
// == Execution de la commande
// ===========================================================

/**
 * Commande version :
 * affiche la version actuelle du bot
 */
module.exports.run = async (wbot, message, args) => {
  /**
   * Longueur argument invalide
   */
  if (args.length < 3) {
    wbot.errors.errorWrongUsage(wbot, this.help.name, message)
    return
  }


  const matiere = args[0]
  const temp = args[1].split('/')
  const date = '20' + temp[2] + '-' + temp[1] + '-' + temp[0]

  args.shift()
  args.shift()
  const contenu = args.join(' ')


  /**
   * Insertion des nouveaux devoirs
   */
  wbot.database.query(`INSERT INTO devoir (devoir_matiere, devoir_contenu, devoir_date, serveur_id) VALUES ("${matiere}", "${contenu}", '` + date + `', (SELECT serveur_id FROM serveur WHERE serveur_discord_id = '${message.guild.id}'))`, function (err, rows, fields) {
    if (err) wbot.logger.log(err, 'error')

    const embed = new Discord.RichEmbed()
      .setColor('#00B200')
      .setTitle('Succès !')
      .setDescription('Le devoir a bien été ajouté, veuillez saisir `!devoirs` pour afficher la liste des devoirs.')
      .setFooter(message.author.username, message.author.avatarURL)
      .setTimestamp()
    message.channel.send(embed)


    /**
     * Update du channel de devoirs
     */
    wbot.updateDevoirsChannel(message)
  })
}



/**
 * Niveau de permission
 */
module.exports.conf = {
  permission: 0
}



/**
 * Propriétés de la commande
 */
module.exports.help = {
  aliases: ['dev_add', 'd_add', 'dev_a', 'da'],
  name: 'devoirs_add',
  shortDesc: 'Ajoute des devoirs',
  longDesc: 'Permet d\'ajouter des devoirs sur le serveur actuel. Pour cela renseignez les paramètres requis (voir exemple), et le bot se chargera ensuite de mettre à jour la liste des devoirs automatiquement.',
  usage: 'devoirs_add <matière> <date> <description>',
  example: 'devoirs_add Maths 30/09/18 Faire les exercices 6 et 9 de la page 420'
}
