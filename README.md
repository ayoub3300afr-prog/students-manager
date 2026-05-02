# 📚 Gestionnaire d'Étudiants
#  🎓 StudentWeb Manager - Documentation UI & Stockage

Ce document présente l’ensemble des interfaces de l’application **StudentWeb Manager** , un tableau de bord destiné aux administrateurs et managers d’établissements scolaires.  
Toutes les données affichées (étudiants, notes, présence, cours, événements) sont **stockées dans le `localStorage` du navigateur**, ce qui permet une démonstration autonome sans base de données externe.
## Interface principale
![screenshot1](all/img1.png)
*La page d'accueil de l'application*

* L'application supporte **le mode nuit / dark mode** sur l'ensemble des pages (Dashboard, Students, Notes, Attendance, Courses, Calendar, Login).

![screenshot2](all/img3.png)
## Ajout d'un étudiant
*Le formulaire d'ajout d'étudiant*
![screenshot2](all/img2.png)

## Annuaire étudiants 
*Tableau listant les étudiants avec ID, nom, filière, présence, statut et actions (Voir, Modifier, Supprimer).  
Filtres et bouton d'export CSV disponibles.*
![screenshot2](all/img40.png)
![screenshot2](all/img4.png)

## Gestion des notes
*Tableau des notes sur 20 avec mentions (Très Bien, Insuffisant).  
Moyenne générale et taux de réussite affichés en haut de page.*
![screenshot2](all/img5.png)

## Gestion de l'assiduité 
*Statistiques de présence par tranche (Bon, Moyen, À risque) avec graphique textuel.  
Tableau des heures de présence par étudiant avec statut associé*
![screenshot2](all/img6.png)

## Gestion des cours
*Liste des cours avec ID, nom, enseignant, inscriptions, crédits et statut.  
Bouton "+Add Course" pour ajouter un nouveau cours dans le localStorage.*
![screenshot2](all/img7.png)

## Calendrier académique simplifié
*Vue mensuelle avec formulaire d'ajout d'événement (date, titre, type).  
Liste des événements à venir (examens, deadlines, réunions).*
![screenshot2](all/img8.png)
![screenshot2](all/img80.png)

## Écran de connexion
*Choix du rôle (Teacher / Admin) avec champs email et mot de passe.  
Citation pédagogique et lien vers conditions d'utilisation.*
![screenshot2](all/login.png)

## 🛠️ Technologies utilisées

- HTML5
- CSS3
- JavaScript
  Ce projet a été développé avec l'assistance (IA) pour :
- la conception des interfaces (CSS)
- L'écriture des scripts JavaScript pour la gestion du localStorage, filtres ..
- Le débogage et l'optimisation du code

## 📂 Fichiers

- `index.html` - Structure de la page
- `style.css` - Styles et mise en page  
- `app.js` - Logique de l'application

## 🚀 Comment l'utiliser

1. Clone le dépôt :
   ```bash
   git clone https://github.com/ayoub3300afr-prog/students-manager.git
