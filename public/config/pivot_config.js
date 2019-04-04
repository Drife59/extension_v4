/*
Projet Corail
Auteur: Benjamin GRASSART
Année: 2019

pivot_config.js

Define specific pivot config.
This need to be set for any modification on pivot config.
*/


// All this code correspond identify each type of pivot.
// There is a perfect correspondance to field "name" in Pivots table (back-end)
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

var CODE_COMPANY = "company";
var CODE_HOMEPHONE = "homephone";

//For now pivot regarding bank card are disabled
//var CODE_CVV_STRING = "cvv";
//var CODE_CARDEXPIRYMONTH = "cardexpirymonth";
//var CODE_CARDEXPIRYYEAR = "cardexpiryyear";

var CODE_FULL_BIRTHDATE = "full_birthdate";


//Only street and name street
var CODE_ADDRESS = "address";
//lastname + firstname
var CODE_FULL_NAME = "full_name";
var CODE_PASSPORT_NUMBER = "passport_number";
var CODE_IDENTITY_CARD = "identity_card";
var CODE_SOCIAL_NUMBER = "social_number";
//Plaque immat
var CODE_DRIVING_LICENCE = "driving_licence";
var CODE_LICENCE_PLATE = "licence_plate";
var CODE_COUNTRY = "country";
var CODE_IBAN = "iban";


//This code in is in db, does not correspond to "pivot name" field
var CODE_RESEARCH = "research";

//Define all pivots in system
var liste_pivots = [CODE_MAIN_EMAIL, CODE_FIRSTNAME, CODE_LASTNAME, CODE_FULL_NAME,
                    CODE_POSTALCODE, CODE_CITY, CODE_MAIN_FULL_ADDRESS, CODE_ADDRESS, CODE_COUNTRY,
                    CODE_CELLPHONE, CODE_HOMEPHONE,
                    CODE_DAY_BIRTH, CODE_MONTH_BIRTH, CODE_YEAR_BIRTH, CODE_FULL_BIRTHDATE,
                    CODE_COMPANY,
                    //CODE_CVV_STRING, CODE_CARDEXPIRYMONTH, CODE_CARDEXPIRYYEAR, CODE_IBAN,
                    CODE_IBAN,
                    CODE_PASSPORT_NUMBER, CODE_IDENTITY_CARD, CODE_SOCIAL_NUMBER, 
                    CODE_DRIVING_LICENCE, CODE_LICENCE_PLATE, 
    ]

//Define pivot where profilless algo shoud occur 
var liste_pivots_profilless = [
    CODE_IBAN,
    CODE_PASSPORT_NUMBER, CODE_IDENTITY_CARD, CODE_SOCIAL_NUMBER, 
    CODE_DRIVING_LICENCE, CODE_LICENCE_PLATE, 
]


