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


//Time to wait for the parsing field to be finished
var timeout_parsing = 250;

//Time to wait for the keys to be created
var timeout_key_creation = timeout_parsing + 2000;

//Time to wait for first profil creation
var timeout_profil_creation = 2000;

var separateur_cle = "_";

//When filling, if the field already has a value then override it (or not)
var override_field_with_value = true;

// --------------
// Log parameters
// --------------

var display_full_technical_log = true;
var enable_front_log = true;

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

//Weight minimum to display pivot-weight in log for a key 
var KEY_WEIGHT_MINIMAL_DISPLAY = 1;

// --------------------
// Profil configuration
// --------------------

var nb_maximum_profil_restitution = 3;

var profil_coeff_decrease = 0.95

var minimum_weight_profil = 0.5;

//We can this value to weight if profil is chosen
var profil_chosen_add_weight = 1;

//Name of the id for list of profil to be injected, in graphical html
var id_list = "list_profil";

var CODE_FILLED_BY_PROFIL = "filledByProfil";
var CODE_FILLED_BY_PROFILLESS = "filledByProfilless";
var CODE_FIELD_CLEARED_USER = "cleared_user";

//When filling with a profil, addind this weight to website key
var weight_key_filling_profil = 5;

//When clearing an input because it is wrong, retrieving this weight
var weight_key_clear_input = 10;

//The weight when sending a pivot to website key
var weight_profil_filled_pivot_known = 10;

//The weight to use when user fill manually a field which have a referent pivot
var weight_manual_filling_pivot_known = 5;

