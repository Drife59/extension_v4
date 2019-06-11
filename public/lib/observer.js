/*
Projet Corail
Auteur: Benjamin GRASSART
Année: 2019

observer.js

Define observer code and configuration to be able to monitor DOM changes.
*/


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

        if(mutation.addedNodes.length == 0){
            console.debug("This mutation dit not add any node. Aborting reloading Corail");
            return false;
        }
        console.debug("Processing node added:" + mutation.addedNodes[0]);
        console.debug("Name of type node: " + mutation.addedNodes[0].nodeName);

        if( !(tag_trigger_corail_relaunch.includes(mutation.addedNodes[0].nodeName) ) ){
            console.debug("The type of insertion is not a possible form insertion. Abort Corail relaunch.");
            return false;
        }

        if(mutation.addedNodes[0].id == "list_profil" ){
            console.debug("The added node was the list profil. Abort Corail relaunch.");
            return false;
        }

        if(mutation.addedNodes[0].id == "id_login_list" ){
            console.debug("The added node was the login profil. Abort Corail relaunch.");
            return false;
        }

        if(mutation.addedNodes[0].length < minimum_size_form_insertion ){
            console.debug("The added node is too short. It's probably not a form. Abort Corail relaunch.");
            return false;
        }

        /*
            Below is the restart Corail process.
            Basically, it rebuild inputs / selects DB, rebuild according website DB,
            and finally relaunch login init.
            Similar to what occur on first DOM loading, except for user front DB.
        */
       
        console.info("A notable DOM modification has been detected.");
        console.info("It is possible a new classic or login form. Relaunching Corail.");
                
        //parse again DOM and build again profil process
        init_fields();

        setTimeout(function () {
            //Inputs object should exist, update website DB if necessary
            fetch_all_field(init_event_list_profil);
    
            //Detect and build again login if needed
            init_event_login_list();
        }, timeout_parsing);
    });
}

// instantiating observer
const observer_corail = new MutationObserver(subscriber);

