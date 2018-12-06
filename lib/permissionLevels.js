const {
    PermissionLevels
} = require("klasa");

module.exports = new PermissionLevels()
    // Commandes accessibles par tout le monde (@everyone)
    .add(0, () => true)
    // Commandes administrateurs
    .add(6, ({
        author,
        client
    }) => author.guild && author.permissions.has("MANAGE_GUILD") || author.permissions.has("ADMINISTRATOR"), {
        fetch: true
    })
    // Commandes guild owner
    .add(7, ({
        author,
        client
    }) => author.guild && author.member === author.guild.owner, {
        fetch: true
    })
    // Commandes bot owner
    .add(9, ({
        author,
        client
    }) => author === client.owner || author.author.id === "255065617705467912", {
        break: true
    })
    // Commandes bot owner silent (n'affiche aucune erreur)
    .add(10, ({
        author,
        client
    }) => author === client.owner || author.id === '255065617705467912')
