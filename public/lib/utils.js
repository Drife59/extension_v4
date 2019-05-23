/*
Projet Corail
Auteur: Benjamin GRASSART
Année: 2019
utils.js

Défini des fonctions utilitaires transversales.
Ce fichier est à importer avant toute fonctionnalitée.
Cf config manifest.json
*/



//Remplace tout les "." et les "$" par des underscores
function securise_cle(cle){
	return cle.replace(/\./g,'_').replace(/\$/g, '_');
}

//Construit une clé (stockage BDD) pour un domaine, id + name + type
function construit_domaine_cle(html_elt){
	if( html_elt.tagName == "INPUT"){
		return securise_cle(html_elt.id + separateur_cle + html_elt.name + separateur_cle + html_elt.type);
	}else if( html_elt.tagName == "SELECT"){
		return securise_cle(html_elt.id + separateur_cle + html_elt.name + separateur_cle + "select");
	}
}

//Génère un uuid compatible RFC4122
function guid() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
	    	.toString(16)
	        .substring(1);
	}
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
           s4() + '-' + s4() + s4() + s4();
}


//Return number from string as float
function string_to_float(string_number){
	if (typeof string_number === 'string' || string_number instanceof String){
		return parseFloat(string_number.replace(",", "."));
	}
	//not a string, return it as it is
	return string_number;
}


/*Return a squeletton for requesting api back on keys.
Only code key is provided, to identify key.
All weight are set to zero and should be updated in main code.*/
function createEmptyKeyRequestObject(code_key){
        var object_result = {};
        object_result["cle"] = code_key;

        for(var i=0 ; i < liste_pivots.length ; i++){
            object_result[liste_pivots[i]] = 0;
        }
        object_result["pivot_reference"] = null;
        /*object_result["first_name"] = 0;
        object_result["family_name"] = 0;
        object_result["postal_code"] = 0;
        object_result["home_city"] = 0;
        object_result["cellphone_number"] = 0;
        object_result["main_email"] = 0;
        object_result["main_full_address"] = 0;
        object_result["day_of_birth"] = 0;
        object_result["month_of_birth"] = 0;
        object_result["year_of_birth"] = 0;
        object_result["company"] = 0;
        object_result["homephone"] = 0;
        object_result["cvv"] = 0;
        object_result["cardexpirymonth"] = 0;
        object_result["cardexpiryyear"] = 0;
        object_result["full_birthdate"] = 0;
        object_result["country"] = 0;*/

        return object_result;
	}
	
//Create a copy based on JSON functionnality
function jsonCopy(src) {
	return JSON.parse(JSON.stringify(src));
}


//Personnalize String object to add a function to capitalize String
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}

//Mark heuristic as used if a field is filled
//by first or second algoritm (beforce dedicated heuristic algoritm)
function mark_heuristic_used(input, key_domain) {
    var weight_heuristic = set_weight_heuristic(input);
    var absolute_top_weigth = find_absolute_top_weigth(weight_heuristic);
    var corresponding_heuristic = get_heuristic_to_use(input, key_domain, weight_heuristic, absolute_top_weigth);

    if (heurisitic_code_error_list.includes(corresponding_heuristic) == false) {
        console.debug("Mark " + key_domain + " as already filled.");
        heuristic_activated[corresponding_heuristic] = true;
    }
}

//https://www.kirupa.com/html5/get_element_position_using_javascript.htm
//Return absolute position in pixel of an element
function getPosition(el) {
	var xPos = 0;
	var yPos = 0;

	while (el) {
		if (el.tagName == "BODY") {
			// deal with browser quirks with body/window/document and page scroll
			var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
			var yScroll = el.scrollTop || document.documentElement.scrollTop;

			xPos += (el.offsetLeft - xScroll + el.clientLeft);
			yPos += (el.offsetTop - yScroll + el.clientTop);
		} else {
			// for all other non-BODY elements
			xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
			yPos += (el.offsetTop - el.scrollTop + el.clientTop);
		}

		el = el.offsetParent;
	}
	return {
		x: xPos,
		y: yPos
	};
}

//Return the number of occurrence of the substring in string
function occurrences_in_string(string, subString, allowOverlapping) {

    string += "";
    subString += "";
    if (subString.length <= 0) return (string.length + 1);

    var n = 0,
        pos = 0,
        step = allowOverlapping ? 1 : subString.length;

    while (true) {
        pos = string.indexOf(subString, pos);
        if (pos >= 0) {
            ++n;
            pos += step;
        } else break;
    }
    return n;
}