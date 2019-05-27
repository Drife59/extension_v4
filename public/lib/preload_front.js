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


//Don't wait for DOM loading for the following action


init_domaine();


chrome.runtime.onConnect.addListener(function(port) {
    console.info("[preload_front] Got connection from background");
    console.assert(port.name == "background_connect");
    port.onMessage.addListener(function(msg) {
        if (msg.profil_values !== undefined){
            console.info("Received profil values objects from background: ");
            console.info(JSON.stringify(request.profil_values, null, 4));
            //sendResponse({farewell: "I got the profil values :)"});

            //NOTE(BG): Here update the profil DB with value from background
        }
    });
});


//2) Preload user from cache, and it's front DB
chrome.storage.sync.get("current_user", function (data) {

    if (typeof data.current_user !== 'undefined') {
        //set global var current user for all app
        console.info("[Front launch] Loaded current user from cache: " + data.current_user);
        current_user = data.current_user;

        //3) Preload website front DB
        console.info("Loading website db from back, creating key and executing heuristics");
        load_website_db_from_back(true);

        //Sending a message to the background script
        chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
            console.info("Received from background script: " + response.farewell);
        });

        load_profils_from_back(data.current_user, true);

        //If the user is here, then the front db should also be here
        load_user_db_from_cache();
    }else{
        console.warn("Cannot find user, please log in.");
    }
});