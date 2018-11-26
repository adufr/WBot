module.exports = {
    /**
     * Gère l'alignement
     *
     * Ajoute des "." en fonction de la taille
     * du string passé en paramètre afin d'aligner
     * différents mots.
     */
    beautify(string, size) {
        if (string.length < size) {
            for (let i = 0; i < size; i++) {
                if (string.length < size) string += '.';
            }
        }
        return string;
    }
}
