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

    if(current_user == undefined){
        console.warn("Cannot find user, aborting software launch");
        return;
    }

    app_launched = true;
    
    
    console.info("Parsing fields...")
    init_fields();

    //In order to load website db from back and execute heuristic,
    //we need to wait parsing field is finished
    setTimeout(function () {
        //Inputs object should exist, update website DB if necessary
        fetch_all_field(init_event_list);

        //If there is a temporary profil in cache, we need to create it in back
        profil_db.create_profil_from_temp_profil();
    }, timeout_parsing);
}

lancement_app();


//When the url change
window.addEventListener('hashchange', function () {
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