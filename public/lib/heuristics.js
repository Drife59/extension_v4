/*
Projet Corail
Auteur: Benjamin GRASSART
Année: 2018

heuristics.js

Define heuristics, used for a new website to guess type of field.
*/

//Define all code for available heuristics
//This NEED to be updated when an heuristic is created
var all_heuristics = [CODE_FIRSTNAME, CODE_LASTNAME, CODE_POSTALCODE, CODE_CITY, CODE_CELLPHONE,
    CODE_MAIN_EMAIL, CODE_MAIN_FULL_ADDRESS, CODE_DAY_BIRTH, CODE_MONTH_BIRTH, CODE_YEAR_BIRTH,
    //V3.3 code 
    CODE_COMPANY, CODE_HOMEPHONE, CODE_CVV_STRING, CODE_CARDEXPIRYMONTH, CODE_CARDEXPIRYYEAR,
    //V4.0 code
    CODE_FULL_BIRTHDATE];

//Save all heuristics which have already been used for restitution
//An heuristic should only be used once
var heuristic_activated = {}

var heuristic_logger = new Logger(CODE_HEURISTIC);

function heuristic_not_used(code_field){
    return heuristic_activated[code_field] === undefined;
}

function is_search_field(field){
    if( field.type == "select"){
        return false;
    }
    
    if( field.type == "search")
        return true;
    //Pour une raison curieuse, plein de champs de recherche porte le nom "q"
    else if ( field.name == "q")
        return true;
           
    return search_name_in_field(field, search_string);
}
    

//Look for a particular functionnal name in field
function search_name_in_field(field, words){
	for( var i=0 ; i<words.length ; i++){
		if( field.name !== undefined && field.name.toLowerCase().indexOf(words[i]) != -1)
			return true;
		if( field.className !== undefined && field.className.toLowerCase().indexOf(words[i]) != -1)
			return true;
		if( field.title !== undefined && field.title.toLowerCase().indexOf(words[i]) != -1)
			return true;
		if( field.id !== undefined && field.id.toLowerCase().indexOf(words[i]) != -1)
			return true;
		if( field.placeholder !== undefined && field.placeholder.toLowerCase().indexOf(words[i]) != -1)
			return true;
	}
	return false;
}

//Remove useless char in label text: ":", "*", useless space and generic word
function cleanLabel(labelText){
    //The spaces for pronoun are very important, since we don't want to break "classical" word (Ville, postal, etc)
    var keywordToDelete = ["Votre", "Vos ", "Ton ", "Ta ", " Tes ", "Entrez", "Entrer", "Confirmez", "Confirmer", " Le ", " La ", " Les "];
    var res = labelText.replace('*', '').replace(':', '');

    for(var i=0 ; i <keywordToDelete.length ; i++){
        res = res.replace(keywordToDelete[i], '');
        res = res.replace(keywordToDelete[i].toLowerCase(), '');
    }
    return res.trim();
}

//Get number of keyword occurences for field
function nb_keyword_in_field(field, words, indice_ponderation){
    var nb_occurences = 0;
    
    //Get all label sibling and look for key word in text
    var labelSibling = getSiblings(field, labelFilter);
	for( var i=0 ; i<words.length ; i++){
		if( field.name !== undefined && field.name.toLowerCase().indexOf(words[i]) != -1)
			nb_occurences = nb_occurences + 1*indice_ponderation;
		if( field.className !== undefined && field.className.toLowerCase().indexOf(words[i]) != -1)
		nb_occurences = nb_occurences + 1*indice_ponderation;
		if( field.title !== undefined && field.title.toLowerCase().indexOf(words[i]) != -1)
			nb_occurences = nb_occurences + 1*indice_ponderation;
		if( field.id !== undefined && field.id.toLowerCase().indexOf(words[i]) != -1)
			nb_occurences = nb_occurences + 1*indice_ponderation;
		if( field.placeholder !== undefined && field.placeholder.toLowerCase().indexOf(words[i]) != -1)
            nb_occurences = nb_occurences + 1*indice_ponderation;
        
        //A field can have many sibling, even if label should be unique
        for(var j=0 ; j<labelSibling.length ; j++){
            var labelFinal = cleanLabel(labelSibling[j].innerText);

            //update score with label found
            if( labelFinal !== undefined && labelFinal.toLowerCase().indexOf(words[i]) != -1){
                heuristic_logger.info("Adding coeff because of keyword: " + words[i] + " for label: " + labelFinal);
                nb_occurences = nb_occurences + 1*indice_ponderation;
            }
        }
	}
	return nb_occurences;
}

function check_not_select(field, value_if_is_select){
	if( field.type == "select"){
		return value_if_is_select;
	}
}

/*  -------------------------------------------------------------------------------
	Heuristic: Define all function to get occurence of keywords for a type of field
	-------------------------------------------------------------------------------
*/

function get_occurence_search_field(field){
	check_not_select(field,0);
	if( field.type == "search")
		return NB_OCCURENCES_FORCE_TYPE;
	
	return nb_keyword_in_field(field, search_string, heuristic_ponderation[CODE_RESEARCH]);
}

function get_occurence_firstname_field(field){
	check_not_select(field,0);
	return nb_keyword_in_field(field, firstname_string, heuristic_ponderation[CODE_FIRSTNAME]);
}

function get_occurence_lastname_field(field){
	check_not_select(field,0);
	return nb_keyword_in_field(field, lastname_string, heuristic_ponderation[CODE_LASTNAME]);
}

function get_occurence_postalcode_field(field){
	check_not_select(field,0);
	return nb_keyword_in_field(field, postalcode_string, heuristic_ponderation[CODE_POSTALCODE]);
}

function get_occurence_city_field(field){
	check_not_select(field,0);
	return nb_keyword_in_field(field, city_string, heuristic_ponderation[CODE_CITY]);
}
	
function get_occurence_phone_field(field){
	check_not_select(field,0);
	return nb_keyword_in_field(field, phone_string, heuristic_ponderation[CODE_CELLPHONE]);
}

function get_occurence_main_email_field(field){
	check_not_select(field,0);

	if( field.type == "email")
		return NB_OCCURENCES_FORCE_TYPE;

	return nb_keyword_in_field(field, email_string, heuristic_ponderation[CODE_MAIN_EMAIL]);
}

function get_occurence_main_full_address_field(field){
	check_not_select(field,0);
	return nb_keyword_in_field(field, address_string, heuristic_ponderation[CODE_MAIN_FULL_ADDRESS]);
}

function get_occurence_daybirth(field){
	return nb_keyword_in_field(field, daybirth_string, heuristic_ponderation[CODE_DAY_BIRTH]);
}

function get_occurence_monthbirth(field){
	return nb_keyword_in_field(field, monthbirth_string, heuristic_ponderation[CODE_MONTH_BIRTH]);
}

function get_occurence_yearbirth(field){
	return nb_keyword_in_field(field, yearbirth_string, heuristic_ponderation[CODE_YEAR_BIRTH]);
}

//V3.3 Heuristic
function get_occurence_company(field){
	return nb_keyword_in_field(field, company_string, heuristic_ponderation[CODE_COMPANY]);
}

function get_occurence_homephone(field){
	return nb_keyword_in_field(field, homephone_string, heuristic_ponderation[CODE_HOMEPHONE]);
}

function get_occurence_cvv(field){
	return nb_keyword_in_field(field, cvv_string, heuristic_ponderation[CODE_CVV_STRING]);
}

function get_occurence_cardexpirydateyear(field){
	return nb_keyword_in_field(field, cardexpirydatemonth_string, heuristic_ponderation[CODE_CARDEXPIRYMONTH]);
}

function get_occurence_cardexpirydateyear(field){
	return nb_keyword_in_field(field, cardexpirydateyear_string, heuristic_ponderation[CODE_CARDEXPIRYYEAR]);
}

//V4.0 Heuristic
function get_occurence_full_birthdate(field){
	return nb_keyword_in_field(field, full_birthdate, heuristic_ponderation[CODE_FULL_BIRTHDATE]);
}

//Define code heuristic / function matching
//This NEED to be updated when creating a new heuristic
var heuristic_code_function_match = new Object();

heuristic_code_function_match[CODE_FIRSTNAME] = get_occurence_firstname_field;
heuristic_code_function_match[CODE_LASTNAME] = get_occurence_lastname_field;
heuristic_code_function_match[CODE_POSTALCODE] = get_occurence_postalcode_field;
heuristic_code_function_match[CODE_CITY] = get_occurence_city_field;
heuristic_code_function_match[CODE_CELLPHONE] = get_occurence_phone_field;
heuristic_code_function_match[CODE_MAIN_EMAIL] = get_occurence_main_email_field;
heuristic_code_function_match[CODE_MAIN_FULL_ADDRESS] = get_occurence_main_full_address_field;
heuristic_code_function_match[CODE_DAY_BIRTH] = get_occurence_daybirth;
heuristic_code_function_match[CODE_MONTH_BIRTH] = get_occurence_monthbirth;
heuristic_code_function_match[CODE_YEAR_BIRTH] = get_occurence_yearbirth;

//V3.3 heuristic
heuristic_code_function_match[CODE_COMPANY] = get_occurence_company;
heuristic_code_function_match[CODE_HOMEPHONE] = get_occurence_homephone;
heuristic_code_function_match[CODE_CVV_STRING] = get_occurence_cvv;
heuristic_code_function_match[CODE_CARDEXPIRYMONTH] = get_occurence_cardexpirydateyear;
heuristic_code_function_match[CODE_CARDEXPIRYYEAR] = get_occurence_cardexpirydateyear;

//V4.0 heuristic
heuristic_code_function_match[CODE_FULL_BIRTHDATE] = get_occurence_full_birthdate;


//Loop on all heuristic available and find/set weight
function set_weight_heuristic(input){
	var weight_heuristic = new Object();
    for(var i=0 ; i<all_heuristics.length ; i++){
		weight_heuristic[all_heuristics[i]] = heuristic_code_function_match[all_heuristics[i]](input);
	}
	return weight_heuristic;
}

//The function below is not used as of now. Keeping it just in case...
//Detect and set all weigth in doublon
function get_weigth_doublon(weight_heuristic){
    var heuristic_weigth_doublon = new Object();

    //save all weigth already found
    var weight_found = new Object();

    //key_heur represent each heuristic_code
    for(var i=0 ; i<all_heuristics.length ; i++){
        //Vars just for the sake of readability
        var code_heur = all_heuristics[i];
        var nb_occurence_for_heuristic_code = weight_heuristic[code_heur];

        //If found twice, mark weight as doublon
        if (nb_occurence_for_heuristic_code in weight_found){ //&& weight_heuristic[key_heur] != 0
            heuristic_weigth_doublon[nb_occurence_for_heuristic_code] = true;
        }
        //Else, indicate the weigth has been found
        else{
            weight_found[nb_occurence_for_heuristic_code] = true;
        }
    }
    heuristic_logger.log("Result of all nb occurences in doublon: " + Object.keys(heuristic_weigth_doublon));
    return heuristic_weigth_doublon;
}


//Check if current code heuristic is a new top weigth
function check_top_weight(weight_heuristic, code_hrtc,  old_code_biggest_weigth, value_biggest_weight,  max_weigth_tolookfor){
    //If there is no max weight, allowed to look for "infite" weight
    if(max_weigth_tolookfor == undefined){
        max_weigth_tolookfor = INFINITE_WEIGTH;
    }

    //Found a new top weight
    if(weight_heuristic[code_hrtc] > value_biggest_weight && 
        weight_heuristic[code_hrtc] < max_weigth_tolookfor){
        code_biggest_weight = code_hrtc
        heuristic_logger.log("Set new biggest weigth value: " + weight_heuristic[code_hrtc] + " corresponding to " + code_biggest_weight);
        return code_biggest_weight;
    }
    return old_code_biggest_weigth;
}

//Return the biggest heurisitic weigth found for an input field
function find_absolute_top_weigth(weight_heuristic){
    var code_biggest_weight = null;
    var value_biggest_weight = 0;

    //Find the biggest heuristic weight for this field, used or not used
    for (var i=0 ; i<all_heuristics.length ; i++) {
        //Just for the sake of readability
        var code_hrtc = all_heuristics[i];

        code_biggest_weight = check_top_weight(weight_heuristic, code_hrtc, code_biggest_weight, value_biggest_weight);
        if( code_biggest_weight != null){
            value_biggest_weight = weight_heuristic[code_biggest_weight]
        }
    }
    heuristic_logger.log("The biggest absolute weigth (used or not) for this field is: " + value_biggest_weight);
    return value_biggest_weight;
}

//Return all heuristic code corresponding to heuristic weigth provided
function find_heuristics_corresponding_to_weigth(weight_heuristic, weigth){
    var results = [];

    for (var i=0 ; i<all_heuristics.length ; i++){
        //Var just for the sake of readability
        var code_hrtc = all_heuristics[i];
        if(weight_heuristic[code_hrtc] == weigth){
            results.push(code_hrtc);
        }
    }
    heuristic_logger.log("Heuristic code corresponding to weigth " + weigth + " are : " + JSON.stringify(results));
    return results;
}

//Set the field in html page and create pivot in domain
function set_value_create_key(input, cle_dom, user_value, code_heuristique){

    console.info("heuristic V5: going to create the key: " + cle_dom + " associated with pivot: " + code_heuristique);

    var key_obj = createEmptyKeyRequestObject(cle_dom);
    //code_heuristique is the corresponding pivot we found
    key_obj["pivot_reference"] = code_heuristique;

    //We associate this pivot with the corresponding weight
    key_obj[code_heuristique] = HEURISTIC_BASE_WEIGHT;
    //console.log("Key obj we are going to send: " + JSON.stringify(key_obj, null, 4));

    //First part, adding new Key
    var xhttp_dom_create = xhttp_add_key_domain(key_obj);

    xhttp_dom_create.onreadystatechange = function () {
        if (xhttp_dom_create.readyState == 4 && xhttp_dom_create.status == 200) {
            heuristic_logger.info("Create key " + cle_dom + 
                " on domain with matching heuristic " + code_heuristique);
        }
    }

    //Set a flag to indicate this heuristic has been used
    heuristic_activated[code_heuristique] = true;

    //Second part, filling field is user value not empty

    //If user value is empty, don't restitue it
    if(user_value == undefined || user_value == "undefined" || user_value == ""){
        console.warn("User value is empty ! ");
        return;
    }

    input.value = user_value;
    //apply_corail_design(input);
    heuristic_logger.info("filling from heuristic " + code_heuristique);

    simulate_user_change(input, user_value);
}

//define error code return for function below
var CODE_NO_MATCHING_HEURISTIC = "no_matching_heuristic";
var CODE_HEURISTIC_ALREADY_USED = "heuristic_already_used";
var CODE_MANY_HEURISTIC_ALL_USED = "many_heuristic_all_used";

var heurisitic_code_error_list = [CODE_NO_MATCHING_HEURISTIC,
                                  CODE_HEURISTIC_ALREADY_USED,
                                  CODE_MANY_HEURISTIC_ALL_USED];

//Given input field, find applicable heuristic or return a dedicated error code
function get_heuristic_to_use(input, cle_dom, weight_heuristic, absolute_top_weigth){
    //Case 1: no heuristic could be matched
    if(absolute_top_weigth == 0){
        heuristic_logger.info("Could not find an heuristic for field " + construit_domaine_cle(input));
        return CODE_NO_MATCHING_HEURISTIC;
    }

    var heuristics_code_top_weigth = find_heuristics_corresponding_to_weigth(weight_heuristic, absolute_top_weigth);

    //Case 2: Only one heuristic matched, corresponding to maximum weigth
    if(heuristics_code_top_weigth.length == 1){
        var matched_code_heur = heuristics_code_top_weigth[0];
        if(heuristic_not_used(matched_code_heur)){
            heuristic_logger.info("Unique heuristic matching. Set for input " + construit_domaine_cle(input) + " heuristic " + matched_code_heur);
            return matched_code_heur;
        }else{
            heuristic_logger.info("Unique heuristic matching, but it is already used. Field not filled.");
            return CODE_HEURISTIC_ALREADY_USED;
        }
    }

    //Case 3: Many heuristic matched for maximum weigth
    //Trying to find one not used
    for(var i=0 ; i<heuristics_code_top_weigth.length ; i++){
        var matched_code_heur = heuristics_code_top_weigth[i];
        if(heuristic_not_used(matched_code_heur)){
            heuristic_logger.info("Many heuristic matching, found one unused." + 
                "Set for input " + construit_domaine_cle(input) + " heuristic " + matched_code_heur);
            return matched_code_heur;
        }
    }
    //Should be a rare case...
    heuristic_logger.info("Many heuristic matching, but could not find an unused heuristic");
    return CODE_MANY_HEURISTIC_ALL_USED;
}

//This is to be used if the association in website cannot be found
//v2 algoritms, weight on heuristic application, without priority
function fill_using_heuristic_v2(input, cle_dom){
    //Object which allow us to save the weight we found on each heuristics
    var weight_heuristic = set_weight_heuristic(input);
    //var heuristic_weigth_doublon = get_weigth_doublon();

    heuristic_logger.log("Weight calculated for: " + construit_domaine_cle(input) + ": " + JSON.stringify(weight_heuristic));

    var absolute_top_weigth = find_absolute_top_weigth(weight_heuristic);
    var corresponding_heuristic = get_heuristic_to_use(input, cle_dom, weight_heuristic, absolute_top_weigth);

    var user_value = user_front_db.value_restitution(corresponding_heuristic)

    //Found a suitable heuristic
    if( heurisitic_code_error_list.includes(corresponding_heuristic) == false){
        set_value_create_key(input, cle_dom, user_value, corresponding_heuristic);
    }  
}
