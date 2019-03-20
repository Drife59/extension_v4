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

var profil_db = null;