/*
Projet Corail
Auteur: Benjamin GRASSART
Année: 2019

heuristic_config.js

Define specific heuristic config.
*/


//All of this need to be properly updated when addind an heuristic

//Define all code for available heuristics
//This NEED to be updated when an heuristic is created
var all_heuristics = [CODE_FIRSTNAME, CODE_LASTNAME, CODE_POSTALCODE, CODE_CITY, CODE_CELLPHONE,
    CODE_MAIN_EMAIL, CODE_MAIN_FULL_ADDRESS, CODE_DAY_BIRTH, CODE_MONTH_BIRTH, CODE_YEAR_BIRTH,
    //V3.3 code 
    //CODE_COMPANY, CODE_HOMEPHONE, CODE_CVV_STRING, CODE_CARDEXPIRYMONTH, CODE_CARDEXPIRYYEAR,
    CODE_COMPANY, CODE_HOMEPHONE,
    //V4.0 code
    CODE_FULL_BIRTHDATE,
    CODE_ADDRESS, CODE_COUNTRY];

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
//heuristic_ponderation[CODE_CVV_STRING] = 1;
//heuristic_ponderation[CODE_CARDEXPIRYMONTH] = 1;
//heuristic_ponderation[CODE_CARDEXPIRYYEAR] = 1;

//V4.0 heuristique
heuristic_ponderation[CODE_FULL_BIRTHDATE] = 1;

//V5.0 heuristique 
heuristic_ponderation[CODE_ADDRESS] = 0.49;
heuristic_ponderation[CODE_FULL_NAME] = 1;
heuristic_ponderation[CODE_PASSPORT_NUMBER] = 1;
heuristic_ponderation[CODE_IDENTITY_CARD] = 1;
heuristic_ponderation[CODE_SOCIAL_NUMBER] = 1;
heuristic_ponderation[CODE_DRIVING_LICENCE] = 1;
heuristic_ponderation[CODE_LICENCE_PLATE] = 1;
heuristic_ponderation[CODE_COUNTRY] = 1;
heuristic_ponderation[CODE_IBAN] = 1;


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
var full_address_string = [];
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

//For now, desactivate all card related stuff
/*var cvv_string = ["cvv", "card-details-security-number","cardsecuritynumber", "securitycode_card"];
var cardexpirydatemonth_string = ["card-details-expiry-date-month", "card_expdate_month", "monthidcardenddate", "cardexpirydatemonth", "cardexpdatemonth", "cardformdatemonth"];
var cardexpirydateyear_string = ["card-details-expiry-date-year", "card_expdate_year", "yearidcardenddate", "cardexpirydateyear", "cardexpdateyear", "cardformdateyear"];
*/



// New heuristique from V4.0
var full_birthdate = ["date de naissance", "date_naissance", "date-naissance"]

// New heuristique from V5.0
var full_name_string = ["full_name"];
var address_string = ["address", "adresse", "adress", "voie", "street", "addr", "adr", "strasse"];
var passport_number_string = ["passport"];
var identity_card_string = [];
var social_number_string = [];
var driving_licence_string = ["driving_licence"];
var licence_plate_string = [];
var country_string = ["country"];
var iban_string = ["iban"];