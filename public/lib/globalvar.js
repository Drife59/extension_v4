/*
Projet Corail
Auteur: Benjamin GRASSART
Année: 2019

globalvar.js

Define globalvar to be set prior to application launched.
*/


var inputs = null;
var selects = [];

//These 4 variables below will be properly initialized in the application lifecycle later on
var profil_db = null;
var user_front_db = null;
var  website_front_db = null;
var login_front_db = null;

//Indicate if a profil was chosen to fill a form
var profil_id_chosen = null;

var current_user = null;
var current_psd = null;

// These 3 var are initiated when loading page
// It allows to share the login form and its fields in all app 
current_login_form     = null;
current_login_field    = null;
current_password_field = null;



