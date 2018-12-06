const {
    KlasaClient
} = require("klasa");

module.exports = KlasaClient.defaultGuildSchema

    /**
     * Configuration des channels
     */
    .add("channels", folder => folder
        .add("tasks", "TextChannel", {
            default: null,
            configurable: true
        })
        .add("notifications", "TextChannel", {
            default: null,
            configurable: true
        }))

    /**
     * Enregistrement des tâches
     */
    .add("tasklist", folder => folder
        .add("tasks", "any", {
            array: true
        }))
