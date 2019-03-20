/*
Projet Corail
Auteur: Benjamin GRASSART
Année: 2019

front.js

Défini le code qui s'exécute pour chaque ouverture de l'extension.
Dernier module à charger dans le manifest.json.
*/


/*
ATTENTION: LES 4 VARIABLES CI-DESSOUS DOIVENT ETRE DEFINIE
AVANT TOUTE EXECUTION DU LOGICIEL.
Elles ne peuvent donc pas être définie dans le fichier de config.
*/

//Permet de savoir si l'app est déjà lancée
//Evite le multiple lancement si plusieurs évènements sont déclenchés
//par la page fille
var app_launched = false;

//Temps d'attente en ms avant remplissage des champs lors du chargement de page
//Attention: un temps d'attente trop court risque de faire échouer le lancement
//de l'app, pour cause de variable globale non-connue
var timeout_parsing = 1500;


var inputs = new Object();
var selects = [];

//Add this variable in file directly.
//If not, bug when using it
var enable_front_log = false;

//Parse page and get all input and select field
function init_fields() {
    //Initialisation des champs input
    for (var i = 0; i < type_to_include.length; i++) {
        inputs[type_to_include[i]] = document.body.querySelectorAll("input[type=" +
            type_to_include[i] + "]");
    }
    //Initialisation des champs selects
    selects = document.body.querySelectorAll("select");
}

//Bind all input to change algo
function bind_inputs() {
    for (var i = 0; i < type_to_include.length; i++) {
        var inputs_type = inputs[type_to_include[i]];

        for (j = 0; j < inputs_type.length; j++) {
            inputs_type[j].addEventListener('change', changeAlgo, false);
        }
    }
}

//Bind all select to change algo
function bind_selects() {
    for (var i = 0; i < selects.length; i++) {
        selects[i].addEventListener('change', changeAlgo, false);
        selects[i].onchange = function (evt) {
            if (enable_front_log)
                console.info("Elément select modifié: " + HtmlEltToString(evt.target));
        };
    }
}

//Set all input to empty value and no corail design
function clear_inputs() {
    var inputs_clear = {};

    //Load inputs
    for (var i = 0; i < type_to_include.length; i++) {
        inputs_clear[type_to_include[i]] = window.document.body.querySelectorAll("input[type=" +
            type_to_include[i] + "]");
    }

    console.log("inputs clear:" + Object.keys(inputs_clear));

    for (var i = 0; i < type_to_include.length; i++) {
        var all_inputs_for_type = inputs_clear[type_to_include[i]];

        for (j = 0; j < all_inputs_for_type.length; j++) {
            console.debug("Name input final to clear: " + all_inputs_for_type[j].name + " / " + all_inputs_for_type[j].value);
            all_inputs_for_type[j].value = "";
            remove_corail_design(all_inputs_for_type[j]);
        }
    }
}

function create_domain(domain){
    var xhttp_dom1 = xhttp_get_domaine(domain);

    xhttp_dom1.onreadystatechange = function () {
        if (xhttp_dom1.readyState == 4 && xhttp_dom1.status == 200)
            console.info("[create domain]: Domain already exist !");
        else if (xhttp_dom1.readyState == 4 && xhttp_dom1.status == 404) {
            if (enable_front_log)
                console.info("[create domain]: Domain " + domain + " was created");
            var xhttp_dom2 = xhttp_create_domaine(domain);
            xhttp_dom2.onreadystatechange = function () {
                if (xhttp_dom2.readyState == 4) {
                    if (enable_front_log)
                        console.debug(xhttp_dom2.responseText);
                }
            }
        }
    }
}

//Create a new domain in back if not already exist
function init_domaine() {
    chrome.storage.sync.get("domain", function (data) {
        if (typeof data.domain !== 'undefined') {
            console.warn("domain exist: " + data.domain);
            if(window.location.host != data.domain){
                console.warn("Domain has changed. Seeding corresponding keys. Updating domain");
                chrome.storage.sync.set({"domain": window.location.host});
                create_domain(window.location.host);
            }
        } else {
            console.debug("domain does not exist, setting it in storage and ram");
            chrome.storage.sync.set({"domain": window.location.host});
            create_domain(window.location.host);
        }
    });
}


/*
################################
POINT D'ENTREE DE L'APPLICATION
################################
*/

//Bind l'évènement onBlur sur les champs détectés
function bind_user_action() {
    init_fields();
    bind_inputs();
    bind_selects();
    chrome.storage.sync.get("current_user", function (data) {
        if (Object.keys(data).length !== 0) {
            fill_fields(data.current_user);
        } else {
            if (enable_front_log)
                console.error("current user introuvable pour le remplissage des champs.")
        }
    });
}

function load_user_db_from_back() {
    chrome.storage.sync.get("current_user", function (data) {
        if (Object.keys(data).length !== 0) {
            //For the sake of clarity
            var current_user = data.current_user;
            if (enable_front_log)
                console.debug("Found current user " + current_user + " for loading user values from back");

            //Loading profile DB
            var profil_db = new UserProfil(current_user);
            profil_db.load_profils_from_back(current_user);


            //V5 Loading, user value for multiple profil

            var xhttp_front_db = xhttp_get_object_front_db(current_user);

            xhttp_front_db.onreadystatechange = function () {
                //Could find user values for this user
                if (xhttp_front_db.readyState == 4 && xhttp_front_db.status == 200) {
                    //user_front_db is load for each page each time. Not very effective...
                    user_front_db = new UserPivotValues(xhttp_front_db.responseText);
                    user_front_db.set_current_user(current_user);
                    console.info("Loaded user values from back: " + user_front_db.get_minimal_display());
                }
                else if (xhttp_front_db.readyState == 4 && xhttp_front_db.status != 200) {
                    if (enable_front_log)
                        console.error("Could not find user values for: " + current_user);
                }
            }
        } else {
            if (enable_front_log)
                console.error("Cannot find current user for user value db loading.");
        }
    });
}

//Load current website keys into website DB
function load_website_db_from_back() {
    console.debug("loading websites keys from back");
    //Just for the sake of clarity
    var domain = window.location.host;
    if (enable_front_log)
        console.debug("Loading values for website " + domain);

    var xhttp_website_db = xhttp_get_keys_v5(domain);

    //website_front_db must exists in all cases
    if( typeof website_front_db === "undefined")
        website_front_db = new WebsiteDb("{}");


    xhttp_website_db.onreadystatechange = function () {
        //website exists
        if (xhttp_website_db.readyState == 4 && xhttp_website_db.status == 200) {
            //TODO: make this more persistent with localStorage
            website_front_db.add_domain_from_back(domain, xhttp_website_db.responseText)
        }
        else if (xhttp_website_db.readyState == 4 && xhttp_website_db.status != 200) {
            if (enable_front_log)
                console.error("Could not load website keys: " + domain);
                
        }
    }
}

//Start app: parsing and binding fields
function lancement_app(type_evt) {
    init_domaine();
    if (enable_front_log)
        console.debug("Loading values from back...");
    //TODO: make this more rare
    load_user_db_from_back();
    load_website_db_from_back();

    if (enable_front_log)
        console.info("Lancement de l'App...");
    app_launched = true;
    setTimeout(function () {
        bind_user_action();
    }, timeout_parsing);
}


window.addEventListener('pageshow', function () {
    if (enable_front_log)
        console.info("window.pageshow event");
    if (!app_launched)
        lancement_app("Pageshow");
});

window.addEventListener('hashchange', function () {
    if (enable_front_log)
        console.info("window.hashchange event");
    if (!app_launched)
        lancement_app("Hashchange");
});

window.addEventListener('unload', function () {
    if (enable_front_log)
        console.info("window.unload event");
    if (!app_launched)
        lancement_app("UnLoad");
});

window.addEventListener('load', function () {
    init_domaine();
    if (enable_front_log)
        console.info("window.load event");
    if (!app_launched)
        lancement_app("Load");
});