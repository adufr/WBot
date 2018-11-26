const {
    KlasaClient
} = require("klasa");

module.exports = KlasaClient.defaultGuildSchema

    /**
     * Configuration des channels
     */
    .add("channels", folder => folder
        .add("tasks", "TextChannel", {
            default: false,
            configurable: true
        })
        .add("notifications", "TextChannel", {
            default: null,
            configurable: true
        }))

    /**
     * Enregistrement des tâches
     */
    .add("tasks", folder => folder
        .add("due_date", "string", {
            array: true
        })
        .add("title", "string", {
            array: true
        })
        .add("description", "string", {
            array: true
        }))
