/*
Projet Corail
Auteur: Benjamin GRASSART
Année: 2019

observer.js

Define observer code and configuration to be able to monitor DOM changes.
*/

// target element that we will observe
//const target = document.body;

// We want to monitor all child of body, if they are added / removed and their data content altered
const observer_config = {
    attributes: false,
    attributeOldValue: false,
    characterData: false,
    characterDataOldValue: false,
    childList: true,
    subtree: true
};

// subscriber function
function subscriber(mutations) {
    mutations.forEach((mutation) => {
        console.debug(mutation);
        console.info("Detected a DOM changes. Reloading login and profil process.");
        init_event_login_list();
    });
}

// instantiating observer
const observer_corail = new MutationObserver(subscriber);

