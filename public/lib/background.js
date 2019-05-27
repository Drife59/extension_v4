/*
Projet Corail
Auteur: Benjamin GRASSART
Année: 2019

background.js

Define functions to be executed in the background.
*/

var background_profil_db = null;


//Wait for messages from the content scripts
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log(sender.tab ?
                  "from a content script:" + sender.tab.url :
                  "from the extension");
      if (request.greeting == "hello")
        sendResponse({farewell: "goodbye"});
});


//2) Preload user from cache, and it's front DB
chrome.storage.sync.get("current_user", function (data) {

    if (typeof data.current_user !== 'undefined') {
        //set global var current user for all app
        console.info("[Front launch] Loaded current user from cache: " + data.current_user);
        current_user = data.current_user;

        
        background_profil_db = load_profils_from_back(data.current_user, false);

        //We wait for the request from back to be finished before initiate object to send to content scripts
        setTimeout( function(){
            var loaded_profil_values = background_profil_db.profil_values
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
            Note(BG): 

            Following event to code:
            
                - onUpdated: Fired when a tab is updated.
                - onCreated: Fired when a tab is created. Note that the tab's URL may not be set at the time this event is fired, but you can listen to onUpdated events so as to be notified when a URL is set.

            */


        },2000);
    }else{
        console.warn("Cannot find user, please log in.");
    }
});
