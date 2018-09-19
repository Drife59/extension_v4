/*
Projet Corail
Auteur: Benjamin GRASSART
Année: 2017

utils.js


Défini des fonctions utilitaires transversales.
Ce fichier est à importer avant toute fonctionnalitée.
Cf config manifest.json
*/

//Renvoit une chaine intelligible pour un element html extrait
function HtmlEltToString(html_elt){
	res = "id:" + html_elt.id + " name: " + html_elt.name + " type: " + html_elt.type ;
	if( html_elt.value != "undefined" && html_elt.value != "")
		return res + " valeur: " + html_elt.value;
	return res;
}

//Vérifie qu'on peut identifier un champ à l'aide de son id ou de son name
function is_valid_field(html_elt){
	return ( html_elt.id != null && html_elt.id != "" || html_elt.name != null && html_elt.id != "" );
}

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

//Recherche une valeur dans un json en string
//Retourne la cle correspondante si trouvé, false sinon
function search_value_in_json(valeur, json){

	var obj = json
	if( typeof json == "string"){
		obj = JSON.parse(json);
	}

	for(var i in obj){
		if(obj[i] == valeur)
			return i; 
	}
	return false;
}

//Recherche une valeur dans un json en string
//Retourne les cles correspondantes si trouvés, false sinon
function search_values_in_json(valeur, json){
	res = [];

	var obj = json
	if( typeof json == "string"){
		obj = JSON.parse(json);
	}

	for(var i in obj){
		if(obj[i] == valeur)
			res.push(i);
	}
	if (res.length == 0)
		return false;
	return res;
}

//Cherche si le pivot passé en paramètre est connu
function search_key_in_json(cle, json_string){
	obj = JSON.parse(json_string);
	return cle in obj;
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

function check_tel_number(num_tel)
{
	// Définition du motif à matcher
	var regex = new RegExp("(0|\\+33|0033)[1-9][0-9]{8}");
	return regex.test(num_tel)
}

function check_card(num_card)
{
	var num_trim = num_card.replace(/ /g,"");
	var regex = new RegExp("[0-9]{16}");
	return regex.test(num_trim)
}

function check_email(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
}

//Vérifie si la valeur d'un champ est vide ou non
function is_empty(field){
	if(field.value == "" || field.value == " " || field.value == null){
		return true;
	}
	return false;
}

function apply_corail_design(input){
    input.className = input.className + " corail_bg";

    //only put image at the right-end if field > 100px width
    if( input.offsetWidth > 100){
        input.className = input.className + " corail_image";
    }
}

//Return number from string as float
function string_to_float(string_number){
	return parseFloat(string_number.replace(",", "."));
}
	