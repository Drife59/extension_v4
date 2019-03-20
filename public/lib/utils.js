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
        object_result["pivot_reference"] = null;
        object_result["first_name"] = 0;
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

        return object_result;
	}
	
//Create a copy based on JSON functionnality
function jsonCopy(src) {
	return JSON.parse(JSON.stringify(src));
}