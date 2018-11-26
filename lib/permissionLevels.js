const {
    PermissionLevels
} = require("klasa");

module.exports = new PermissionLevels()
    // Commandes accessibles par tout le monde (@everyone)
    .add(0, () => true)
    // Commandes administrateurs
    .add(6, (c, m) => m.guild && m.member.permissions.has("MANAGE_GUILD") || m.member.permissions.has("ADMINISTRATOR"), {
        fetch: true
    })
    // Commandes guild owner
    .add(7, (c, m) => m.guild && m.member === m.guild.owner, {
        fetch: true
    })
    // Commandes bot owner
    .add(9, (c, m) => m.author === c.owner || m.author.id === "255065617705467912", {
        break: true
    })
    // Commandes bot owner silent (n'affiche aucune erreur)
    .add(10, (c, m) => m.author === c.owner || m.author.id === "255065617705467912");
