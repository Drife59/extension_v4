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



//1) Preload user from cache, and it's front DB
chrome.storage.sync.get("current_user", function (data) {
    if (typeof data.current_user !== 'undefined') {
        //set global var current user for all app
        console.info("[Front launch] Loaded current user from cache: " + data.current_user);
        current_user = data.current_user;

        //2) Preload website front DB
        console.info("Loading website db from back, creating key and executing heuristics");
        load_website_db_from_back(true);

        load_profils_from_cache(data.current_user);

        //If the user is here, then the front db should also be here
        load_user_db_from_cache();
    }else{
        console.warn("Cannot find user, please log in.");
    }
});


//Start app: parsing and binding fields
function lancement_app() {

    if(current_user == undefined){
        console.warn("Cannot find user, aborting software launch");
        return;
    }

    app_launched = true;
    init_domaine();
    
    console.info("Parsing fields...")
    init_fields();

    //In order to load website db from back and execute heuristic,
    //we need to wait parsing field is finished
    setTimeout(function () {
        //Inputs object should exist, update website DB if necessary
        fetch_all_field(init_event_list);

        //If there is a temporary profil in cache, we need to create it in back
        profil_db.create_profil_from_temp_profil(init_event_list);
    }, timeout_parsing);

    //In order to initialize events, we need all keys to be created in front
    /*setTimeout(function () {
        console.info("Initializing events...")
        init_event_list();
    }, timeout_key_creation);*/
}


//When the url change
window.addEventListener('hashchange', function () {
});

window.addEventListener('load', function () {
    console.info("window.load event");
    if (!app_launched)
        lancement_app("Load");
});


/*Note(BG): Be careful, it is impossible to predict how much execution time you have in unload event*/
window.addEventListener('unload', function () {
    console.info("window.unload event");

    if(inputs == null){
        console.warn("[Unload Event] Inputs object (containing all inputs) does not exist. Abort check for new profil");
        return;
    }

    var pivot_value_page = create_pivot_value_from_page();
    console.info("Pivot-value from previous page: " + JSON.stringify(pivot_value_page, null,4));

    var minimum_profil = profil_db.has_minimum_attribute(pivot_value_page);

    //form content is suitable to create a profil
    if(minimum_profil == true){
    
        var profil_page = create_profil_from_page(pivot_value_page);
        //The profil build from the page does not exist. Creating it.
        if(profil_db.check_profil_existence(profil_page) == false){
            //Last but not least, before execution fil is finished, 
            //add the new fake profil in front and save it in cache
            profil_db.add_fake_profil_front_only(profil_page);
        }else{
            console.info("The profil analysed from previous form already exists");
        }
    }else{
        console.info("profil from form does not meet the minimum requirement");
    }

    profil_db.set_profil_storage();
});