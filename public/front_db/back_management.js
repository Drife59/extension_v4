/*
Projet Corail
Auteur: Benjamin GRASSART
Année: 2019

back_management.js

Define high level method to deal with back-end
*/

function create_domain(domain){
    var xhttp_dom1 = xhttp_get_domaine(domain);

    xhttp_dom1.onreadystatechange = function () {
        if (xhttp_dom1.readyState == 4 && xhttp_dom1.status == 200)
            console.info("[create domain]: Domain already exist !");
        else if (xhttp_dom1.readyState == 4 && xhttp_dom1.status == 404) {
            if (enable_front_log)
                console.info("[create domain]: Domain " + domain + " was created");
            var xhttp_dom2 = xhttp_create_domaine(domain);
            xhttp_dom2.onreadystatechange = function () {
                if (xhttp_dom2.readyState == 4) {
                    if (enable_front_log)
                        console.debug(xhttp_dom2.responseText);
                }
            }
        }
    }
}

//Create a new domain in back if not already exist
function init_domaine() {
    create_domain(window.location.host);
}


/*The 3 function below load the 3 front db and optionnaly save it in google storage*/

function load_user_db_from_back(email, save_in_cache) {
    
    if (enable_front_log)
        console.debug("Found current user " + email + " for loading user values from back");

    var xhttp_front_db = xhttp_get_object_front_db(email);

    xhttp_front_db.onreadystatechange = function () {
        //Could find user values for this user
        if (xhttp_front_db.readyState == 4 && xhttp_front_db.status == 200) {
            //user_front_db is load for each page each time. Not very effective...
            user_front_db = new UserPivotValues(xhttp_front_db.responseText);
            user_front_db.set_current_user(email);
            console.info("Loaded user values V5 profilless from back: " + user_front_db.get_minimal_display());

            if(save_in_cache == true){
                user_front_db.set_user_db_storage();
            }
        }
        else if (xhttp_front_db.readyState == 4 && xhttp_front_db.status != 200) {
            if (enable_front_log)
                console.error("Could not find user values for: " + email);
        }
    }
}

function load_user_db_from_cache(){
    //Need to have an empty JSON object to create the object
    user_front_db = new UserPivotValues("{}");
    user_front_db.get_userdb_storage(true);
    console.info("[load_user_db_from_cache] Loaded user db (profilless) from cache");
}

//Load current website keys into website DB
function load_website_db_from_back(save_in_cache, callback) {
    console.debug("loading websites keys from back");
    //Just for the sake of clarity
    var domain = window.location.host;
    if (enable_front_log)
        console.debug("Loading values for website " + domain);

    var xhttp_website_db = xhttp_get_keys_v5(domain);

    //website_front_db must exists in all cases
    if( website_front_db == null )
        website_front_db = new WebsiteDb("{}");


    xhttp_website_db.onreadystatechange = function () {
        //website exists
        if (xhttp_website_db.readyState == 4 && xhttp_website_db.status == 200) {

            website_front_db.add_domain_from_back(domain, xhttp_website_db.responseText);
            console.info("[load_website_db_from_back] Website db content = " + website_front_db.get_all_key_minimal_display());

            if(callback != undefined){
                callback();
            }

            if(save_in_cache == true){
                website_front_db.set_websitedb_storage();
            }
        }
        else if (xhttp_website_db.readyState == 4 && xhttp_website_db.status != 200) {
            if (enable_front_log)
                console.error("Could not load website keys: " + domain);
                
        }
    }
}

function load_website_db_from_cache(){
    website_front_db = new WebsiteDb("{}");
    website_front_db.get_websitedb_storage();
    console.info("[load_website_db_from_cache] Loaded website db from cache");
}

// Load profil from back-end, and optionnally send back to background
// the profil DB received 
function load_profils_from_back(email, send_profil_background){
    console.info("[load_profils_from_back] Loading profil for user " + email + ", saving in background: " + send_profil_background);
    profil_db = new UserProfil(email);
    var xhttp_get_profil = xhttp_get_profils(email);
    var xhttp_get_values = xhttp_all_values_with_profil(email);

    var json_profil = null;
    var json_values = null;

    xhttp_get_profil.onreadystatechange = function () {
        if (xhttp_get_profil.readyState == 4 && xhttp_get_profil.status == 200) {
            json_profil = JSON.parse(xhttp_get_profil.response);

            if (xhttp_get_values.readyState == 4 && xhttp_get_values.status == 200) {
                console.info("[load_profils]: profils and values were loaded from back, starting building profil DB");
                profil_db.build_profil_from_json(json_profil, json_values);
            }

            if(send_profil_background == true){
                profil_db.set_profil_background();
            }

        }else if(xhttp_get_profil.readyState == 4 && xhttp_get_profil.status != 200){
            console.warn("[load_profils]: loading profils for " + email + " failed.");
        }
    }

    xhttp_get_values.onreadystatechange = function () {
        if (xhttp_get_values.readyState == 4 && xhttp_get_values.status == 200) {
            json_values = JSON.parse(xhttp_get_values.response);

            if (xhttp_get_profil.readyState == 4 && xhttp_get_profil.status == 200) {
                console.info("[load_profils]: profils and values were loaded from back, starting building profil DB");
                profil_db.build_profil_from_json(json_profil, json_values);
            }

            if(send_profil_background == true){
                profil_db.set_profil_background();
            }
        }else if(xhttp_get_values.readyState == 4 && xhttp_get_values.status != 200){
            console.warn("[load_profils]: loading profil values for " + email + " failed.");
        }
    }
    return profil_db;
}

function load_profils_from_cache(email){
    console.info("[load_profils_from_cache] Loading profil from cache");
    profil_db = new UserProfil(email);
    profil_db.get_profil_storage(true);
}