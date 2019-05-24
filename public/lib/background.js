/*
Projet Corail
Auteur: Benjamin GRASSART
Année: 2019

background.js

Define functions to be executed in the background.
*/

//2) Preload user from cache, and it's front DB
chrome.storage.sync.get("current_user", function (data) {

    if (typeof data.current_user !== 'undefined') {
        //set global var current user for all app
        console.info("[Front launch] Loaded current user from cache: " + data.current_user);
        current_user = data.current_user;

        load_profils_from_back(data.current_user, true);

        //If the user is here, then the front db should also be here
    }else{
        console.warn("Cannot find user, please log in.");
    }
});
