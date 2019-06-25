/*
Projet Corail
Auteur: Benjamin GRASSART
Année: 2019

background.js

Background management for profil interaction.
Mainly save, maintain and retrieve profil DB for all tab.
Manage some interaction with back-end.

This file is getting executed when browser is launch.
*/

var background_profil_db = null;


// Init communication listenner for message from content scripts
// Note(BG): the runtime.onMessage only works for message from content scripts,
// background scripts cannot send message using this one
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



// When a tab gets activated. Need to send the update profil values DB
// If background profil is null, because no user was connected when the background started,
// Try to reload data from back
chrome.tabs.onActivated.addListener(function(tab) {
    var delay_to_send_request = 10;
    
    //At this point, if background_profil is null we need to reload it from back
    if(background_profil_db == null){
        console.info("[background] A reload from back-end for user profil is needed.");
        init_background_profil();
        //Will send to message only when background is loaded
        delay_to_send_request = 2000;
    }

    port = chrome.tabs.connect(tab.tabId, { name: "background_connect"});
    console.info("Tab id " + tab.tabId + " was activated.");
    console.log(port.name);


    //Wait for back request if needed
    setTimeout(function () {
        if(background_profil_db != null){
            console.info("Sending current profil values db content");
            port.postMessage({"profil_values": background_profil_db.profil_values});
        }
        else{
            console.info("[background] Don't send profil values, background_profil is null");
        }
    }, delay_to_send_request); 
});


function init_background_profil(){
    console.info("[background] Start background profil initialisation...");
    //2) Preload user from cache, and it's front DB
    chrome.storage.sync.get("current_user", function (data_user) {

        if (typeof data_user.current_user !== 'undefined') {
            //set global var current user for all app
            current_user = data_user.current_user.email;
            current_psd = data_user.current_user.password;

            if(current_psd == null || current_psd == undefined){
                console.warn("Could load current user but not current psd. Abort loading profil.");
                return false;
            }
            background_profil_db = load_profils_from_back(current_user, false);
        }
        else{
            console.info("[background] No user could be found in cache.");
        }
    });
}

//When launching browser, init background profil
init_background_profil();




