/*
Projet Corail
Auteur: Benjamin GRASSART
Année: 2019

fill_fields.js

Define dedicated algoritm to fill fields.
*/


//Simulate that the user did really modify the field himself
//If not used when should be, issue occur, like wrong design,
//or impossibility to validate form
function simulate_user_change(input, user_value) {
    console.debug("Algo load: simulate user change on field: " + construit_domaine_cle(input));
    //Simulate click and focus on the field. Usefull for some form
    var event = new Event('click');
    input.dispatchEvent(event);

    event = new Event('focus');
    input.dispatchEvent(event);

    input.value = user_value;
    apply_corail_design(input);

    //Simulate changing value and quitting form field
    event = new Event('input');
    input.dispatchEvent(event);

    var event = new Event('blur');
    input.dispatchEvent(event);
}

//Mark heuristic as used if a field is filled
//by first or second algoritm (beforce dedicated heuristic algoritm)
function mark_heuristic_used(input, key_domain) {
    var weight_heuristic = set_weight_heuristic(input);
    var absolute_top_weigth = find_absolute_top_weigth(weight_heuristic);
    var corresponding_heuristic = get_heuristic_to_use(input, key_domain, weight_heuristic, absolute_top_weigth);

    if (heurisitic_code_error_list.includes(corresponding_heuristic) == false) {
        console.debug("Algo load : mark " + key_domain + " as already filled.");
        heuristic_activated[corresponding_heuristic] = true;
    }
}

//Rempli un champ sur la page web si connu du domaine 
//et de l'utilisateur.
function fill_field(input, domain) {
    var key_domain = construit_domaine_cle(input);

    //Careful ! a select is always not empty    
    if (!is_empty(input) && input.tagName != "SELECT") {
        console.info("Field associated with Key domain + " + key_domain +
            " is already filled from website. Don't fill it.");
        //If field is already filled by original website, avoid corresponding heuristic
        mark_heuristic_used(input, key_domain);
        return;
    }

    //First algoritm, load value from user if pivot is known and field is not already filled

    if(website_front_db.has_key(domain, key_domain)){

        var pivot_reference = website_front_db.get_referent_pivot(domain, key_domain);
        var user_value = user_front_db.value_restitution(pivot_reference)
        
        //Found a suitable value to fill
        if (user_value != null && user_value != ' ' && user_value != '') {
            console.debug("Loading value <" + user_value + "> from user for pivot: " + pivot_reference);
            simulate_user_change(input, user_value);
            mark_heuristic_used(input, key_domain);
        }else{
            console.debug("User does not have a value for pivot: " + pivot_reference);
        }
    }

    //Cannot find key in website
    //Third algoritm, try filling using heuristics based on field
    else {
        fill_using_heuristic_v2(input, key_domain);
    }
}

function fill_fields_v5() {
    //New loading, we should reset heuristic utilisation
    heuristic_activated = {}

    console.info("Algo load: loading input field...");

    //technical log is very verbose, must be explicit required for display
    if(display_full_technical_log){
        console.debug("Content in website db: " + JSON.stringify(website_front_db.website_key, null, 4));
    }
    console.info(website_front_db.get_all_key_minimal_display());

    var domain = window.location.host;

    //parcours tous les inputs trouvés et essaye de les remplir 
    for (var i = 0; i < type_to_include.length; i++) {
        var inputs_type = inputs[type_to_include[i]];

        for (j = 0; j < inputs_type.length; j++) {
            if (!is_search_field(inputs_type[j])) {
                fill_field(inputs_type[j], domain);
            }
        }
    }

    //parcours tous les selects trouvés et essaye de les remplir
    for (var i = 0; i < selects.length; i++) {
        fill_field(selects[i], domain);
    }
}