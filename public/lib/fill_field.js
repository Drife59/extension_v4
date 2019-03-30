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



// --------------
// V6 New filling
// --------------

function fill_field_v6(input, domain, profil_id) {
    var key_domain = construit_domaine_cle(input);

    //Careful ! a select is always not empty    
    if (!is_empty(input) && input.tagName != "SELECT" && !override_field_with_value) {
        console.info("Field associated with Key domain + " + key_domain +
            " is already filled from website. Don't fill it.");
        return;
    }

    //Load value from user if pivot is known and field is not already filled
    //First try with profil, then with a value profilless

    if(website_front_db.has_key(domain, key_domain)){

        var pivot_reference = website_front_db.get_referent_pivot(domain, key_domain);
        if( pivot_reference == null ){
            console.debug("No pivot reference for key: " + key_domain);
            return;
        }
        
        //First try to fill with profil
        var user_value = profil_db.get_value_for_pivot(profil_id, pivot_reference);

        if(user_value != false){
            if (user_value != null && user_value != ' ' && user_value != '') {
                //We need to "mark" this field as filled by profil, for algo onChange
                input.setAttribute(CODE_FILLED_BY_PROFIL, profil_id);
                console.debug("Filling input : " + key_domain + " using profil " + profil_id + " with value: " + user_value);
            }
        }

        //Value is not found in profil, try to get it from profilles value
        if(user_value == false){
            user_value = user_front_db.value_restitution(pivot_reference);
            if (user_value != null && user_value != ' ' && user_value != '') {
                input.setAttribute(CODE_FILLED_BY_PROFILLESS, true);
                console.debug("Filling input : " + key_domain + " using profilless  value: " + user_value);
            }
        }
        
        //Found a suitable value to fill
        if (user_value != null && user_value != ' ' && user_value != '') {
            simulate_user_change(input, user_value);
        }else{
            console.debug("User does not have a value for pivot: " + pivot_reference);
        }
    }
}

function fill_fields_v6(profil_id) {
    //New loading, we should reset heuristic utilisation
    heuristic_activated = {};

    console.info("[fill_fields_v6]: loading input field...");

    //technical log is very verbose, must be explicit required for display
    if(display_full_technical_log){
        console.debug("[fill_fields_v6]: Raw content in V5 website db: " + JSON.stringify(website_front_db.website_key, null, 4));
    }
    console.info("[fill_fields_v6] Website Db content: " + website_front_db.get_all_key_minimal_display());

    var domain = window.location.host;

    //Try to fill every field
    for (var i = 0; i < type_to_include.length; i++) {
        var inputs_type = inputs[type_to_include[i]];

        for (j = 0; j < inputs_type.length; j++) {
            if (!is_search_field(inputs_type[j])) {
                fill_field_v6(inputs_type[j], domain, profil_id);
            }
        }
    }

    //Try to fill every select
    for (var i = 0; i < selects.length; i++) {
        fill_field_v6(selects[i], domain, profil_id);
    }
}