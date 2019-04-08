/*
Projet Corail
Auteur: Benjamin GRASSART
Année: 2019

globalvar.js

Define globalvar to be set prior to application launched.
*/

//Temps d'attente en ms avant remplissage des champs lors du chargement de page
//Attention: un temps d'attente trop court risque de faire échouer le lancement
//de l'app, pour cause de variable globale non-connue
var timeout_parsing = 1500;


var inputs = new Object();
var selects = [];

//These 3 variables below will be properly initialized in the application lifecycle later on
var profil_db = null;
var user_front_db = null;
var  website_front_db = null;

//Indicate if a profil was chosen to fill a form
var profil_id_chosen = null;

var current_user = null;