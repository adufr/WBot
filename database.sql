#------------------------------------------------------------
#        Script MySQL.
#------------------------------------------------------------


#------------------------------------------------------------
# Table: serveur
#------------------------------------------------------------

CREATE TABLE serveur (
        serveur_id Int Auto_increment NOT NULL,
        serveur_discord_id Int NOT NULL,
        serveur_prefix Varchar(8) NOT NULL,
        serveur_channel_id Int NOT NULL,
        server_role_admin_id Int NOT NULL,
        server_role_notif_id Int NOT NULL, CONSTRAINT serveur_PK PRIMARY KEY (serveur_id)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: devoir
#------------------------------------------------------------

CREATE TABLE devoir (
        devoir_id Int Auto_increment NOT NULL,
        devoir_matiere Varchar(128) NOT NULL,
        devoir_contenu Longtext NOT NULL,
        devoir_date Date NOT NULL,
        serveur_id Int NOT NULL, CONSTRAINT devoir_PK PRIMARY KEY (devoir_id), CONSTRAINT devoir_serveur_FK FOREIGN KEY (serveur_id) REFERENCES serveur (serveur_id)
)ENGINE=InnoDB;
