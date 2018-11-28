/*
Projet Corail
Auteur: Benjamin GRASSART
Année: 2018

config.js

Défini la config de l'application.
Ce module est à importer en premier dans le manifest.json.
*/

// ---------------------
// General configuration
// ---------------------

//Scrappe la page web et affiche les infos sur les champs trouvés
analyse_page_web = false;

//Bind l'écoute des champs clients pour exécution des algo
bind_client = true;

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

var enable_heuristic_log = true;
var enable_front_db_log = false;
var enable_load_log = false;
var enable_change_log = false;


// ------------------------------
// Config for heuristic algoritms
// ------------------------------

//All of this need to be properly updated when addind an heuristic

//This is the code we use to identify type of field
//firstname, lastname, postalcode, city, tel
//Correspond to field "name" in Pivots table
var CODE_FIRSTNAME = "first_name";
var CODE_LASTNAME  = "family_name";
var CODE_POSTALCODE = "postal_code";
var CODE_CITY = "home_city";
var CODE_CELLPHONE = "cellphone_number";
var CODE_MAIN_EMAIL = "main_email";
var CODE_MAIN_FULL_ADDRESS = "main_full_address";
var CODE_DAY_BIRTH = "day_of_birth";
var CODE_MONTH_BIRTH = "month_of_birth";
var CODE_YEAR_BIRTH = "year_of_birth";

//V3.3 Heuristic
var CODE_COMPANY = "company";
var CODE_HOMEPHONE = "homephone";
var CODE_CVV_STRING = "cvv";
var CODE_CARDEXPIRYMONTH = "cardexpirymonth";
var CODE_CARDEXPIRYYEAR = "cardexpiryyear";

//V4.0 Heuristic
var CODE_FULL_BIRTHDATE = "full_birthdate";

//This code in is in db, does not correspond to "pivot name" field
var CODE_RESEARCH = "research";


//Define ponderation for each list of keywords
var heuristic_ponderation = new Object();
heuristic_ponderation[CODE_FIRSTNAME] = 1;
heuristic_ponderation[CODE_LASTNAME] = 1;
heuristic_ponderation[CODE_POSTALCODE] = 1.5;
heuristic_ponderation[CODE_CITY] = 1.5;
heuristic_ponderation[CODE_CELLPHONE] = 1;
heuristic_ponderation[CODE_MAIN_EMAIL] = 1;
heuristic_ponderation[CODE_MAIN_FULL_ADDRESS] = 0.49;
heuristic_ponderation[CODE_DAY_BIRTH] = 1;
heuristic_ponderation[CODE_MONTH_BIRTH] = 1;
heuristic_ponderation[CODE_YEAR_BIRTH] = 1;

//V3.3 heuristique
heuristic_ponderation[CODE_COMPANY] = 1;
heuristic_ponderation[CODE_HOMEPHONE] = 1;
heuristic_ponderation[CODE_CVV_STRING] = 1;
heuristic_ponderation[CODE_CARDEXPIRYMONTH] = 1;
heuristic_ponderation[CODE_CARDEXPIRYYEAR] = 1;

//V4.0 heuristique
heuristic_ponderation[CODE_FULL_BIRTHDATE] = 1;

heuristic_ponderation[CODE_RESEARCH] = 1;

// Define keywords per heuristic we will look for

var search_string = ["search", "recherche"];

/* List of keys after Ju Research in old Mongo DB*/
var lastname_string = ["lastname", "familyname", "last-name", "last_name", "family-name", "family_name", "lname","nachname","surname"];
var postalcode_string = ["postalcode", "zipcode", "codepostal", "code-postal", "postal-code", "postcode", "postal_code", "code_postal"];

var firstname_string = ["firstname", "forename", "prenom", "first-name", "first_name", "fname", "vorname", "forename", "prénom", "firstNM"];
var city_string = ["city", "town", "ville"];
//- ATTENTION, il y a souvent ADDRESS & CITY (ou adr ou addr) (exception de la règle de 2)
var phone_string = ["phone", "telephone", "mobile","portable", "telefon", "telport"];
//- A retirer : TEL ? (Trop petit… donc à risque "telecomande").
//- ATTENTION, il y a souvent ADDRESS dans le tel ! (ou adr ou addr) (exception de la règle de 2) ?
var email_string = ["email","courriel", "login","mail"];
//- ATTENTION, il y a souvent ADDRESS dans le mail ! (ou adr ou addr) (exception de la règle de 2) ?
var address_string = ["address", "adresse", "adress", "voie", "street", "addr", "adr", "strasse"];
//- Il va falloir être intelligent pour différencier full_adress & address_number + address_voie + adresse_etc.
//Look for a single birthmonth field
var monthbirth_string = ["monthbirth", "monthbirth", "month_of_birth", "moisnaissance", "dnmois", "moisbday", "birthdaymonth","dob-month", "dob_month", 
                         "birthdate_month", "birthdatemonth", "bday-month", "birth_month", "birthm", "datenaism", "birthdaymonth","birthday_month", 
                         "birthday-month", "month_birthday", "month-birthday", "month-birth", "month_birth", "birth-month", "birthdayfields_month"];
//- Bcp avec month seul(qui peut être trop d’autres informations
var daybirth_string = ["day_birthday", "daybirth", "day_of_birth", "journaissance", "dnjour", "day_journaissance", "birthdayday", "daybirthday", "birthdayfields_day",
                       "birthdate_day", "day_birthdate", "day_birth", "birth_day", "birth-day", "day-birth", "jourbday", "datenaisj", "day_dob", "dob_day",
                       "dob-day", "day-dob", "birthdayday", "dateofbirth_day", "dateofbirth-day", "birthdate-day", "jour_naissance", "bday-day", "day_bday"];
var yearbirth_string = ["yearbirth", "yearbirth", "year_of_birth", "anneenaissance", "dnannee", "year_birthday", "yearbirth", "year_of_birth", "anneenaissance",
                        "dnannee", "year_journaissance", "birthdayyear", "yearbirthday", "birthyear", "birthdate_year", "year_birthdate", "year_birth", 
                        "birth_year", "birth-year", "year-birth", "yearbday", "datenaisa", "year_dob", "dob_year", "dob-year", "year-dob", "birthdayyear",
                        "dateofbirth_year", "dateofbirth-year", "birthdate-year", "annee_naissance", "bday-year", "year_bday", "anneebday", "birthy", "birth-year",
                        "birthdayfields_year"];

//New heuristics from V3.3
var company_string = ["company", "enterprise"];
var homephone_string = ["telephonefixe", "telephone_fixe", "homephone","home_phone"];
var cvv_string = ["cvv", "card-details-security-number","cardsecuritynumber", "securitycode_card"];
var cardexpirydatemonth_string = ["card-details-expiry-date-month", "card_expdate_month", "monthidcardenddate", "cardexpirydatemonth", "cardexpdatemonth", "cardformdatemonth"];
var cardexpirydateyear_string = ["card-details-expiry-date-year", "card_expdate_year", "yearidcardenddate", "cardexpirydateyear", "cardexpdateyear", "cardformdateyear"];

// New heuristique from V4.0
var full_birthdate = ["date de naissance", "date_naissance", "date-naissance"]

var INFINITE_WEIGTH = 1000;
//Define nb occurence to force field type
var NB_OCCURENCES_FORCE_TYPE = 100;

// ----------------------------
// Config accès API (endpoints)
// ----------------------------


//Serveur C# dev local
var endpoint_back_up = "http://localhost:1665/"

//Serveur C# prod V4
//var endpoint_back_up = "https://corail.me:4001/"

//Serveur C# integ V4
//var endpoint_back_up = "https://corail.me:2001/"


//Website front DB setup
var MIN_KEY_PIVOT_WEIGHT = -100;
var MAX_KEY_PIVOT_WEIGHT = 100;

//Personalisation du js
//A mettre dans un fichier à part si cette partie grossi

//Ajoute un fonction aux objets String pour
//mettre la première lettre en majuscule et la dernière en minuscule
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}