/*
Projet Corail
Auteur: Benjamin GRASSART
Année: 2019

globalvar.js

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
    chrome.storage.sync.get("domain", function (data) {
        if (typeof data.domain !== 'undefined') {
            console.warn("domain exist: " + data.domain);
            if(window.location.host != data.domain){
                console.warn("Domain has changed. Seeding corresponding keys. Updating domain");
                chrome.storage.sync.set({"domain": window.location.host});
                create_domain(window.location.host);
            }
        } else {
            console.debug("domain does not exist, setting it in storage and ram");
            chrome.storage.sync.set({"domain": window.location.host});
            create_domain(window.location.host);
        }
    });
}


function load_user_db_from_back() {
    chrome.storage.sync.get("current_user", function (data) {
        if (Object.keys(data).length !== 0) {
            //For the sake of clarity
            var current_user = data.current_user;
            if (enable_front_log)
                console.debug("Found current user " + current_user + " for loading user values from back");

            //Loading profile DB
            var profil_db = new UserProfil(current_user);
            profil_db.load_profils_from_back(current_user);


            //V5 Loading, user value for multiple profil

            var xhttp_front_db = xhttp_get_object_front_db(current_user);

            xhttp_front_db.onreadystatechange = function () {
                //Could find user values for this user
                if (xhttp_front_db.readyState == 4 && xhttp_front_db.status == 200) {
                    //user_front_db is load for each page each time. Not very effective...
                    user_front_db = new UserPivotValues(xhttp_front_db.responseText);
                    user_front_db.set_current_user(current_user);
                    console.info("Loaded user values from back: " + user_front_db.get_minimal_display());
                }
                else if (xhttp_front_db.readyState == 4 && xhttp_front_db.status != 200) {
                    if (enable_front_log)
                        console.error("Could not find user values for: " + current_user);
                }
            }
        } else {
            if (enable_front_log)
                console.error("Cannot find current user for user value db loading.");
        }
    });
}

//Load current website keys into website DB
function load_website_db_from_back() {
    console.debug("loading websites keys from back");
    //Just for the sake of clarity
    var domain = window.location.host;
    if (enable_front_log)
        console.debug("Loading values for website " + domain);

    var xhttp_website_db = xhttp_get_keys_v5(domain);

    //website_front_db must exists in all cases
    if( typeof website_front_db === "undefined")
        website_front_db = new WebsiteDb("{}");


    xhttp_website_db.onreadystatechange = function () {
        //website exists
        if (xhttp_website_db.readyState == 4 && xhttp_website_db.status == 200) {
            //TODO: make this more persistent with localStorage
            website_front_db.add_domain_from_back(domain, xhttp_website_db.responseText)
        }
        else if (xhttp_website_db.readyState == 4 && xhttp_website_db.status != 200) {
            if (enable_front_log)
                console.error("Could not load website keys: " + domain);
                
        }
    }
}