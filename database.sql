-- phpMyAdmin SQL Dump
-- version 4.8.2
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le :  sam. 06 oct. 2018 à 10:27
-- Version du serveur :  10.1.34-MariaDB
-- Version de PHP :  7.2.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `wbot`
--

-- --------------------------------------------------------

--
-- Structure de la table `devoir`
--

CREATE TABLE `devoir` (
  `devoir_id` int(8) NOT NULL,
  `devoir_matiere` varchar(128) NOT NULL,
  `devoir_contenu` longtext NOT NULL,
  `devoir_date` date NOT NULL,
  `serveur_id` int(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `serveur`
--

CREATE TABLE `serveur` (
  `serveur_id` int(8) NOT NULL,
  `serveur_discord_id` bigint(128) NOT NULL,
  `serveur_nom` varchar(256) NOT NULL,
  `serveur_prefix` varchar(8) NOT NULL DEFAULT '!',
  `serveur_date_join` datetime NOT NULL,
  `serveur_channel_id` bigint(128) DEFAULT NULL,
  `serveur_role_admin_id` bigint(128) DEFAULT NULL,
  `serveur_role_notif_id` bigint(128) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `serveur`
--

INSERT INTO `serveur` (`serveur_id`, `serveur_discord_id`, `serveur_nom`, `serveur_prefix`, `serveur_date_join`, `serveur_channel_id`, `serveur_role_admin_id`, `serveur_role_notif_id`) VALUES
(1, 358623719914209301, 'WBot', '!', '2018-10-06 10:26:31', NULL, NULL, NULL);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `devoir`
--
ALTER TABLE `devoir`
  ADD PRIMARY KEY (`devoir_id`),
  ADD KEY `devoir_serveur_FK` (`serveur_id`);

--
-- Index pour la table `serveur`
--
ALTER TABLE `serveur`
  ADD PRIMARY KEY (`serveur_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `devoir`
--
ALTER TABLE `devoir`
  MODIFY `devoir_id` int(8) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `serveur`
--
ALTER TABLE `serveur`
  MODIFY `serveur_id` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `devoir`
--
ALTER TABLE `devoir`
  ADD CONSTRAINT `devoir_serveur_FK` FOREIGN KEY (`serveur_id`) REFERENCES `serveur` (`serveur_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
