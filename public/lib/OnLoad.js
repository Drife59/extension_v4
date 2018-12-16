/*
Projet Corail
Auteur: Benjamin GRASSART
Année: 2018

OnLoad.js

Défini les algoritmes lors de l'évènement onLoad,
Pour précharger les valeurs.
*/

var OnLoadLogger = new Logger(CODE_LOAD);

//Simulate that the user did really modify the field himself
//If not used when should be, issue occur, like wrong design,
//or impossibility to validate form
function simulate_user_change(input, user_value) {
    OnLoadLogger.log("Algo load: simulate user change on field: " + construit_domaine_cle(input));
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
function mark_heuristic_used(input, cle_dom) {
    var weight_heuristic = set_weight_heuristic(input);
    var absolute_top_weigth = find_absolute_top_weigth(weight_heuristic);
    var corresponding_heuristic = get_heuristic_to_use(input, cle_dom, weight_heuristic, absolute_top_weigth);

    if (heurisitic_code_error_list.includes(corresponding_heuristic) == false) {
        OnLoadLogger.log("Algo load : mark " + cle_dom + " as already filled.");
        heuristic_activated[corresponding_heuristic] = true;
    }
}

//Rempli un champ sur la page web si connu du domaine 
//et de l'utilisateur.
function fill_field(input, domain) {
    var cle_dom = construit_domaine_cle(input);

    //Careful ! a select is always not empty    
    if (!is_empty(input) && input.tagName != "SELECT") {
        OnLoadLogger.info("Field associated with Key domain + " + cle_dom +
            " is already filled from website. Don't fill it.");
        //If field is already filled by original website, avoid corresponding heuristic
        mark_heuristic_used(input, cle_dom);
        return;
    }

    //First algoritm, load value from user if pivot is known and field is not already filled
    /*
    if (cle_dom in website_front_db[domain]) {
        console.log("cle_dom: " + cle_dom);

        var pivot_trouve = pivots_domaines[cle_dom];
        OnLoadLogger.info("Algo Load / first algo: Key domain" + cle_dom + " associated with pivot " + pivot_trouve);

        var user_value = user_front_db.value_restitution(pivot_trouve)

        //Found a suitable value to fill
        if (user_value != null && user_value != ' ' && user_value != '') {
            OnLoadLogger.log("Pivot " + pivot_trouve + ": loading value <" + user_value + "> from user profile.");
            simulate_user_change(input, user_value);
            mark_heuristic_used(input, cle_dom);
        } else if (user_value == ' ') {
            OnLoadLogger.info("Algo Load / first algo: found pivot " + pivot_trouve +
                " for user, but not activated, so no restitution.");
        }
    }*/

    //Third algoritm, try filling using heuristics based on field
    else {
        fill_using_heuristic_v2(input, cle_dom);
    }
}

function fill_fields(email) {
    //New loading, we should reset heuristic utilisation
    heuristic_activated = {}

    OnLoadLogger.log("Algo load: loading input field...");
    console.log("Content in website db: " + JSON.stringify(website_front_db.website_key, null, 4));

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