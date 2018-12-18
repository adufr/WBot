const {
    Command
} = require("klasa");
const {
    MessageEmbed
} = require("discord.js");
const moment = require('moment');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            runIn: ["text"],
            cooldown: 10,
            permissionLevel: 0,
            aliases: ["tasks", "task", "t", "taches", "tache", "devoirs", "d", "devoir"],
            requiredPermissions: ["USE_EXTERNAL_EMOJIS"],
            description: "Affiche la liste des tâches",
        });
        this.usageCustom = "%tasklist";
        this.example = "%tasklist";
    }

    async run(msg) {
        // Vérification envoie sur un serveur
        if (!msg.guild) return msg.reply(`cette commande ne fonctionne pas en message privé pour le moment !`);

        // Si le serveur n'a aucune tâches
        if (!msg.guild.settings.tasklist.tasks[0]) return msg.reply(`Il n'y a aucune tâche à venir...\nPour en ajouter, veuillez exécuter la commande \`%addtask\` ou vous référer à l'aide avec la commande \`%help addtask\`.`);

        // Embed avec la liste des tâches
        const embed = new MessageEmbed()
            .setColor(4886754)
            .setThumbnail(this.client.user.displayAvatarURL())
            .setTimestamp()
            .setFooter('Dernière mise-à-jour', this.client.user.displayAvatarURL());

        // Verifie si la date du devoir est aujourd'hui
        // Si oui, cela va afficher Aujourd'hui dans l'affichage des devoirs
        const currentDate = new Date(Date.now());
        const aujourdhui = moment(currentDate).format('DD/MM/YY');

        // Verifie si la date du devoir est demain
        // Si oui, cela va afficher Demain dans l'affichage des devoirs
        const demain = moment(currentDate.setDate(currentDate.getDate() + 1)).format('DD/MM/YY');

        // Pour chaque entrée, on vérifie la date
        var datePassage;
        msg.guild.settings.tasklist.tasks.forEach(task => {
            // Date de la tâche
            let date = moment(task.due_date).format('DD/MM/YY');
            let weekday = moment(task.due_date).isoWeekday();

            // Rajouter la tâche au bon endroit dans l'embed
            // Si le field avec la date existe déjà : ça l'ajoute
            // Sinon, création d'un nouveau field
            // (gère aussi la traduction pour "ajourd'hui" & "demain")
            if (datePassage && datePassage === date) {
                embed.fields[embed.fields.length - 1].value += `\n**\`${this.client.funcs.beautify(task.title, 14)}\`** - ${task.description}`
            } else if (date === aujourdhui) {
                embed.addField(`Aujourd'hui :`, `**\`${this.client.funcs.beautify(task.title, 14)}\`** - ${task.description}`)
            } else if (date === demain) {
                embed.addField('Demain :', `**\`${this.client.funcs.beautify(task.title, 14)}\`** - ${task.description}`)
            } else {
                embed.addField(formatDate(date, weekday) + ' :', '**`' + this.client.funcs.beautify(task.title, 14) + '`** - ' + task.description)
            }

            datePassage = date;
        });

        msg.send(embed);
    }

};



/**
 * Renvoie un string contenant
 * notre date formatée
 */
function formatDate(date, weekday) {
    let temp = date.split('/');

    var jour = '';
    switch (weekday) {
        case 1:
            jour = 'Lundi';
            break;
        case 2:
            jour = 'Mardi';
            break;
        case 3:
            jour = 'Mercredi';
            break;
        case 4:
            jour = 'Jeudi';
            break;
        case 5:
            jour = 'Vendredi';
            break;
        case 6:
            jour = 'Samedi';
            break;
        case 7:
            jour = 'Dimanche';
            break;
    }

    var mois = ''
    switch (temp[1]) {
        case '01':
            mois = 'Janvier';
            break;
        case '02':
            mois = 'Février';
            break;
        case '03':
            mois = 'Mars';
            break;
        case '04':
            mois = 'Avril';
            break;
        case '05':
            mois = 'Mai';
            break;
        case '06':
            mois = 'Juin';
            break;
        case '07':
            mois = 'Juillet';
            break;
        case '08':
            mois = 'Août';
            break;
        case '09':
            mois = 'Septembre';
            break;
        case '10':
            mois = 'Octobre';
            break;
        case '11':
            mois = 'Novembre';
            break;
        case '12':
            mois = 'Décembre';
            break;
    }
    return `${jour} ${temp[0]} ${mois}`;
}