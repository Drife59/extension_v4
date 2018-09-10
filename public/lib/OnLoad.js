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
function simulate_user_change(input, user_value){
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
function mark_heuristic_used(input, cle_dom){
    var weight_heuristic = set_weight_heuristic(input);
    var absolute_top_weigth = find_absolute_top_weigth(weight_heuristic);
    var corresponding_heuristic = get_heuristic_to_use(input, cle_dom, weight_heuristic, absolute_top_weigth);

    if( heurisitic_code_error_list.includes(corresponding_heuristic) == false){
        OnLoadLogger.log("Algo load : mark " + cle_dom + " as already filled.");
        heuristic_activated[corresponding_heuristic] = true;
    } 
}

//Rempli un champ sur la page web si connu du domaine 
//et de l'utilisateur.
function fill_field(input, pivots_domaines){
    var cle_dom = construit_domaine_cle(input);

    if( !is_empty(input)){
        OnLoadLogger.info("Field associated with Key domain + " + cle_dom + 
        " is already filled from website. Don't fill it.");
        //If field is already filled by original website, avoid corresponding heuristic
        mark_heuristic_used(input, cle_dom);
        return;
    }

    

    //First algoritm, load value from user if pivot is known and field is not already filled
    if (cle_dom in pivots_domaines){
        var pivot_trouve = pivots_domaines[cle_dom];
        OnLoadLogger.info("Algo Load / first algo: Key domain" + cle_dom + " associated with pivot " + pivot_trouve);

        var user_value = user_front_db.value_restitution(pivot_trouve)

        //Found a suitable value to fill
        if(user_value != null && user_value != ' ' && user_value != ''){
            OnLoadLogger.log("Pivot " + pivot_trouve + ": loading value <" + user_value + "> from user profile.");
            simulate_user_change(input, user_value);
            mark_heuristic_used(input, cle_dom);
        }else if(user_value == ' '){
            OnLoadLogger.info("Algo Load / first algo: found pivot " + pivot_trouve + 
                " for user, but not activated, so no restitution.");
        }
    }
    //Second algoritm, there is value (from website) but no domain pivot
    //but no pivot associated. Try to load pivot from user and create it in domain

    //Second algoritm is for now desactivated. It create issue in DBmark_heuristic_used
    // Not ready for V2 version. Not ready at all for future multivaluation

    /*
    else if (input.value != "" && input.value != "undefined"){
        OnLoadLogger.debug("Algo Load / Second algo: found value <" + input.value + 
            "> but no pivot in domain. Trying to associate pivot in domain.");
        var pivot_user = search_value_in_json(input.value, pivots_user);
        mark_heuristic_used(input, cle_dom);

        if(pivot_user != false && pivot_user != "false"){
            OnLoadLogger.log("Algo Load / Second algo: user pivot user known, adding it in domain");            
            var xhttp_dom_create = xhttp_add_pivot_domaine(cle_dom, pivot_user);

            xhttp_dom_create.onreadystatechange = function () {
                if (xhttp_dom_create.readyState == 4 && xhttp_dom_create.status == 200) {
                    OnLoadLogger.info("Algo Load / Second algo: associate " + pivot_user + 
                    " into domain from user value " + input.value + ".");
                }
            }
        }
    }
    */
    //Third algoritm, try filling using heuristics based on field
    else{
        fill_using_heuristic_v2(input, cle_dom);
    }
}

function fill_fields(email){
    //New loading, we should reset heuristic utilisation
    heuristic_activated = {}

    OnLoadLogger.log("Algo load: loading input field...");

    var xhttp_domaine = xhttp_get_cles_domaine_v1();
    //argggggh putain c'est callback hell ici. Putain de langage
    xhttp_domaine.onreadystatechange = function () {
        if (xhttp_domaine.readyState == 4 && xhttp_domaine.status == 200) {
            var pivots_domaines = JSON.parse(xhttp_domaine.responseText);

            //parcours tous les inputs trouvés et essaye de les remplir 
            for(var i=0 ; i<type_to_include.length ; i++){
                var inputs_type = inputs[type_to_include[i]];
        
                for( j=0 ; j<inputs_type.length ; j++){
                    if( !is_search_field(inputs_type[j])){
                        fill_field(inputs_type[j], pivots_domaines);
                    }
                }
            }

            //parcours tous les selects trouvés et essaye de les remplir
            for(var i=0 ; i<selects.length ; i++){
                fill_field(selects[i], pivots_domaines);
            }
        }
    }
}