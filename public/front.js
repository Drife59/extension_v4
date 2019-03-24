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

    //Load all front db
    
    //profil object need email of current user
    chrome.storage.sync.get("current_user", function (data) {
        if (typeof data.current_user !== 'undefined') {
            load_profils_from_cache(data.current_user);
            console.info("[get_userdb_storage]Loaded current user from cache: " + data.current_user);

            //If the user is here, then the front db should also be here
            load_user_db_from_cache();
            load_website_db_from_back(true);
        }
        else{
            console.warn("Cannot find user, please log in.");
        }
    });
    

    if (enable_front_log)
        console.info("Lancement de l'App...");
    app_launched = true;
    setTimeout(function () {
        console.info("Parsing fields...")
        init_fields();
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