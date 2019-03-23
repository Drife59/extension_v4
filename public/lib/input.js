/*
Projet Corail
Auteur: Benjamin GRASSART
Année: 2019

input.js

Define all methods needed to manipulate input field/ 
*/

//Parse page and get all input and select field
function load_fields() {
    //Initialisation des champs input
    for (var i = 0; i < type_to_include.length; i++) {
        inputs[type_to_include[i]] = document.body.querySelectorAll("input[type=" +
            type_to_include[i] + "]");
    }
    //Initialisation des champs selects
    selects = document.body.querySelectorAll("select");
}

//Bind all input to change algo
function bind_inputs() {
    for (var i = 0; i < type_to_include.length; i++) {
        var inputs_type = inputs[type_to_include[i]];

        for (j = 0; j < inputs_type.length; j++) {
            inputs_type[j].addEventListener('change', changeAlgo, false);
        }
    }
}

//Bind all select to change algo
function bind_selects() {
    for (var i = 0; i < selects.length; i++) {
        selects[i].addEventListener('change', changeAlgo, false);
        selects[i].onchange = function (evt) {
            if (enable_front_log)
                console.info("Elément select modifié: " + HtmlEltToString(evt.target));
        };
    }
}

//Set all input to empty value and no corail design
function clear_inputs() {
    var inputs_clear = {};

    //Load inputs
    for (var i = 0; i < type_to_include.length; i++) {
        inputs_clear[type_to_include[i]] = window.document.body.querySelectorAll("input[type=" +
            type_to_include[i] + "]");
    }

    console.log("inputs clear:" + Object.keys(inputs_clear));

    for (var i = 0; i < type_to_include.length; i++) {
        var all_inputs_for_type = inputs_clear[type_to_include[i]];

        for (j = 0; j < all_inputs_for_type.length; j++) {
            console.debug("Name input final to clear: " + all_inputs_for_type[j].name + " / " + all_inputs_for_type[j].value);
            all_inputs_for_type[j].value = "";
            remove_corail_design(all_inputs_for_type[j]);
        }
    }
}

//Parse page and bind event on field
function init_fields() {
    load_fields();
    bind_inputs();
    bind_selects();
}

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

function apply_corail_design(input){
    input.className = input.className + " corail_bg";

    //only put image at the right-end if field > 100px width
    if( input.offsetWidth > 100){
        input.className = input.className + " corail_image";
    }
}

function remove_corail_design(input){
    input.className = input.className.replace("corail_bg", " ");
    input.className = input.className.replace("corail_image", " ");
}

// Filter an html element on type
// string_type_elem can be "a", "input", etc.
function genericFilter(elem, string_type_elem) {
    return elem.nodeName.toLowerCase() == string_type_elem;
}

//Return True if element is a label
function labelFilter(elem){
    return genericFilter(elem, 'label');
}


//Get all siblings of an elt
function getSiblings(el, filter) {
    var siblings = [];
    el = el.parentNode.firstChild;
    do { if (!filter || filter(el)) siblings.push(el); } while (el = el.nextSibling);
    return siblings;
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


//Fetch all fields in page, create key - pivot where possible, else empty key
function fetch_all_field(){

    //Create var only once, will be initialised a lot in loop
    var key_domain = null;

    var domain = window.location.host;

    //Input
    for (var i = 0; i < type_to_include.length; i++) {
        var inputs_type = inputs[type_to_include[i]];

        for (j = 0; j < inputs_type.length; j++) {
            if (!is_search_field(inputs_type[j])) {
                key_domain = construit_domaine_cle(inputs_type[j]);
                if(!website_front_db.has_key(domain, key_domain)){
                    console.info("Running heuristic for domain " + domain + " key(input): " + key_domain);
                    run_heuristic_v6(domain, inputs_type[j], key_domain);
                }

                //If not heuristic could be found properly, create empty key
                if(!website_front_db.has_key(domain, key_domain)){
                    console.info("Creating empty key for " + domain + " key (input): " + key_domain);
                    website_front_db.create_key(domain, key_domain);
                }
            }
        }
    }

    //Select
    for (var i = 0; i < selects.length; i++) {
        key_domain = construit_domaine_cle(selects[i]);

        if(!website_front_db.has_key(domain, key_domain)){
            console.info("Running heuristic for domain " + domain + " key (select): " + key_domain);
            run_heuristic_v6(domain, selects[i], key_domain);
        }

        //If not heuristic could be found properly, create empty key
        if(!website_front_db.has_key(domain, key_domain)){
            console.info("Creating empty key for " + domain + " key (select): " + key_domain);
            website_front_db.create_key(domain, key_domain);
        }
    }
}