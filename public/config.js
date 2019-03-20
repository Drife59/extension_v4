/*
Projet Corail
Auteur: Benjamin GRASSART
Année: 2019

config.js

Défini la config de l'application.
Ce module est à importer en premier dans le manifest.json.
*/

// ---------------------
// General configuration
// ---------------------

//Type de champ input à traiter par le logiciel
var type_to_include = ["text", "email", "tel",
                       "date", "time", "datetime", "number", "color", "url"];

//Temps d'attente en ms avant remplissage des champs lors du chargement de page
//Note(BG): ne marche pas ici, doit être chargé au niveau du fichier entry point front.js
var timeout_parsing = 1000;

var separateur_cle = "_";

// --------------
// Log parameters
// --------------

var display_full_technical_log = false;
var enable_front_log = false;

// ----------------------------
// Config accès API (endpoints)
// ----------------------------


//Serveur C# dev local
var endpoint_back = "http://localhost:1665/"

//Serveur C# prod V4
//var endpoint_back = "https://corail.me:4001/"

//Serveur C# integ V4
//var endpoint_back = "https://corail.me:2001/"


// ----------------------------
// Key and values configuration
// ----------------------------

var INFINITE_WEIGTH = 1000;
//Define nb occurence to force field type
var NB_OCCURENCES_FORCE_TYPE = 100;

//Website front DB setup
var MIN_KEY_PIVOT_WEIGHT = -100;
var MAX_KEY_PIVOT_WEIGHT = 100;

//if > to the var below, a key is considered associated to pivot (website db)
var VALIDATED_ASSOCIATION_WEIGHT = 45;

//Weight set when creating pivot with heuristic
var HEURISTIC_BASE_WEIGHT = 45;

var CODE_PIVOT_REFERENT = "pivot_reference";

//CAUTION: when starting a new deployment, this need to be = HEURISTIC_BASE_WEIGHT
//If not, system is stuck and no user values can be created
var WEIGHT_MINIMUM_RESTITUTION = 60;

//Weight minimum to display pivot-weight in log for a key 
var KEY_WEIGHT_MINIMAL_DISPLAY = 1;