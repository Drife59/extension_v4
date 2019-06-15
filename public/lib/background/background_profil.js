/*
Projet Corail
Auteur: Benjamin GRASSART
Année: 2019

background.js

Background management for profil interaction.
Mainly save, maintain and retrieve profil DB for all tab.
Manage some interaction with back-end. 
*/

var background_profil_db = null;


//Wait for messages from the content scripts
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ?
            " Got request from tab :" + sender.tab.url :
            "from the extension");
    if (request.action == ACTION_GET_PROFIL_BDD){
        sendResponse({
            "code": CODE_RECEPTION_OK,
            "profil_values": background_profil_db.profil_values
        });
    }
    else if( request.action == ACTION_SET_PROFIL_BDD){
        console.info("[background] Got request to update profil DB, with following content: ");
        console.info(JSON.stringify(request.profil_values, null, 4));
        background_profil_db.profil_values = request.profil_values;
        sendResponse({"code": CODE_RECEPTION_OK});
    }
    else if( request.action == ACTION_CLEAR_PROFIL_BDD){
        console.info("[background] Got request to clear profil DB");
        background_profil_db.profil_values = {};
        background_profil_db.current_user = null;
        sendResponse({"code": CODE_RECEPTION_OK});
    }
    else if( request.action == ACTION_SEND_WEIGHT_PROFIL_BDD){
        console.info("[background] Got request to send profil weight to backend");
        background_profil_db.update_all_weight_in_back();
        sendResponse({"code": CODE_RECEPTION_OK});
    }
});


//2) Preload user from cache, and it's front DB
chrome.storage.sync.get("current_user", function (data_user) {

    if (typeof data_user.current_user !== 'undefined') {
        //set global var current user for all app
        current_user = data_user.current_user.email;
        current_psd = data_user.current_user.password;
        if(current_psd != null && current_psd !== undefined){
            background_profil_db = load_profils_from_back(current_user, false);
                console.info("[background.js] find current user & psd. Loading profil.");
        }
        else{
            console.warn("[background.js] Could not load current_psd, so could not load profil.");
        }

        //We wait for the request from back to be finished before initiate object to send to content scripts
        setTimeout( function(){
            console.info("[background.js] The profil values loaded from back are as follow: ");
            console.info(JSON.stringify(background_profil_db.profil_values, null, 4));


            //Connect the content scripts

            // When a tab gets activated. Need to send the update profil values DB
            chrome.tabs.onActivated.addListener(function(tab) {
                port = chrome.tabs.connect(tab.tabId, { name: "background_connect"});
                console.info("Tab id " + tab.tabId + " was activated.");
                console.log(port.name);

                console.info("Sending current profil values db content");
                port.postMessage({"profil_values": background_profil_db.profil_values});
            });

            /*
            Note(BG): Here there are 2 events I was wondering if I should add it: 
                - onCreated: Fired when a tab is created.
                - onUpdated: Fired when a tab is updated.

            However, I finnally decided to not add it.
            Indeed, the main content script when loading is requesting the current state of the DB,
            therefore we should not need to manage these events.
            */


        },2000);
    }else{
        console.warn("Cannot find user, please log in.");
    }
});
