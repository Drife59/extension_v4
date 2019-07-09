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


function lancement_app() {

    if (current_user == undefined) {
        console.warn("Cannot find user, aborting software launch");
        return;
    }

    app_launched = true;

    load_login_from_back(current_user, window.location.host);

    console.info("Parsing fields...")
    init_fields();


    //In order to load website db from back and execute heuristic,
    //we need to wait parsing field is finished
    setTimeout(function () {
        //Inputs object should exist, update website DB if necessary
        fetch_all_field(init_event_list_profil);

        init_event_login_list();

        //If there is a temporary profil in cache, we need to create it in back
        profil_db.create_profil_from_temp_profil();

        // Start DOM observation
        if (hot_reload_activation == true) {
            observer_corail.observe(document.body, observer_config);
        }

        setTimeout(function (){
            launch_periodic_check_login();
        }, 1000);
    }, timeout_parsing);
}

lancement_app();


//When the url change
window.addEventListener('hashchange', function () {
});


/*Note(BG): Be careful, it is impossible to predict how much execution time you have in unload event*/
window.addEventListener('unload', function () {
    console.info("window.unload event");

    //When quitting a tab, I want to send the updated weight.
    //I do it from the background and not the content script, 
    //because the content script is going to be deleted by brwser very soon
    if (current_user != null && current_user != undefined) {
        console.info("[unload event] Requesting background to update weight");
        chrome.runtime.sendMessage({ action: ACTION_SEND_WEIGHT_PROFIL_BDD }, function (response) {
            if (response.code == CODE_RECEPTION_OK) {
                console.info("Request to update profil weight was received & processed by background");
            }
        });
    }

    if (inputs == null) {
        console.warn("[Unload Event] Inputs object (containing all inputs) does not exist. Abort check for new profil");
        return;
    }

    var pivot_value_page = create_pivot_value_from_page();
    console.info("Pivot-value from previous page: " + JSON.stringify(pivot_value_page, null, 4));

    var minimum_profil = has_minimum_attribute(pivot_value_page);

    //form content is suitable to create a profil
    if (minimum_profil == true) {

        var profil_page = create_profil_from_page(pivot_value_page);
        //The profil build from the page does not exist. Creating it.
        if (profil_db.check_profil_existence(profil_page) == false) {
            //Last but not least, before execution fil is finished, 
            //add the new fake profil in front and save it in cache
            profil_db.add_fake_profil_front_only(profil_page);
        } else {
            console.info("The profil analysed from previous form already exists");
        }
    } else {
        console.info("profil from form does not meet the minimum requirement");
    }
});