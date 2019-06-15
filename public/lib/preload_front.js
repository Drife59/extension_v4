/*
Projet Corail
Auteur: Benjamin GRASSART
Année: 2019

front.js

Entry point module when loading a webpage.
*/


//Don't wait for DOM loading for the following action

init_domaine();

//Add a listener to update profil DB if background requests it
chrome.runtime.onConnect.addListener(function(port) {
    console.info("[preload_front] Received profil DB from background");
    console.assert(port.name == "background_connect");
    port.onMessage.addListener(function(msg) {
        if (msg.profil_values !== undefined){
            console.info("Received profil values objects from background: ");
            console.info(JSON.stringify(msg.profil_values, null, 4));

            //NOTE(BG): Here update the profil DB with value from background
            if(current_user != null){
                if(profil_db == null){
                    console.info("Profil DB does not exist, creating it from values send by background");
                    profil_db = new UserProfil(current_user, msg.profil_values);
                }
                //profil DB already exist, just set new values
                else{
                    console.info("Profil DB already exist, updating values and user");
                    profil_db.current_user  = current_user;
                    profil_db.profil_values = msg.profil_values; 
                }

                //After having update the profil DB object, we need to rebuild the display
                init_event_list_profil();
            }
            else{
                console.warn("[preload front] Current user does not exist, cannot update profil DB");
            }
        }
    });
});


//2) Preload user from cache, and it's front DB
chrome.storage.sync.get("current_user", function (data) {

    if (typeof data.current_user !== 'undefined') {
        //set global var current user for all app
        console.info("[Front launch] Loaded current user from cache: " + data.current_user);
        current_user = data.current_user;
        console.info("Profil DB initialisation: requesting content from background");

        //3) Preload website front DB
        console.info("Loading website db from back, creating key and executing heuristics");
        load_website_db_from_back(true);

        //Get current profil DB content from background script
        chrome.runtime.sendMessage({action: ACTION_GET_PROFIL_BDD}, function(response) {
            console.info("Profil value received from background: " + JSON.stringify(response.profil_values,null, 4));
            console.info("Initializing profil with received profil values object from background");
            profil_db = new UserProfil(current_user, response.profil_values);

            //Here, the front script should take care of building the list
            //We are in the preload script, after all :)
        });

        //If the user is here, then the legacy profilless front db should also be here
        load_user_db_from_cache();

        //If we could find the current user, then we should be able to find the current psd
        chrome.storage.sync.get("current_psd", function (data) {
            if (typeof data.current_psd !== 'undefined') {
                console.info("[Front launch] Loaded current psd " + data.current_psd);
                current_psd = data.current_psd;
            }
            else{
                console.warn("[Front launch] Could load user but not psd. Logging out");
            }
        });
    }else{
        console.warn("[Front launch] Cannot find user, please log in.");
    }
});