/*
Projet Corail
Auteur: Benjamin GRASSART
Année: 2019

front.js

Entry point module when loading a webpage.
*/

//Permet de savoir si l'app est déjà lancée
//Evite le multiple lancement si plusieurs évènements sont déclenchés
//par la page fille
var app_launched = false;



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