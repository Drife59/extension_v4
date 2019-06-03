/*
Projet Corail
Auteur: Benjamin GRASSART
Année: 2019

input.js

Define all methods needed to manipulate input field/ 
*/

//Parse page and get all input and select field
function load_fields(callback) {
    inputs = new Object();
    
    //Initialisation des champs input
    for (var i = 0; i < type_to_include.length; i++) {
        inputs[type_to_include[i]] = document.body.querySelectorAll("input[type=" +
            type_to_include[i] + "]");
    }
    //Initialisation des champs selects
    selects = document.body.querySelectorAll("select");

    if(callback != undefined){
        callback();
    }
}

//Bind all input to change algo
function bind_inputs() {
    for (var i = 0; i < type_to_include.length; i++) {
        var inputs_type = inputs[type_to_include[i]];

        for (j = 0; j < inputs_type.length; j++) {
            inputs_type[j].addEventListener('change', changeAlgo, false);
            inputs_type[j].addEventListener('keydown', keyDownAlgo, false);
        }
    }
    console.info("[bind_inputs]Binding all events to input fileds")
}

//Reverse bind input
function unbind_inputs() {
    for (var i = 0; i < type_to_include.length; i++) {
        var inputs_type = inputs[type_to_include[i]];

        for (j = 0; j < inputs_type.length; j++) {
            inputs_type[j].removeEventListener('change', changeAlgo, false);
            inputs_type[j].removeEventListener('keydown', keyDownAlgo, false);
            //Front graphical_profil "init_event_list"
            inputs_type[j].removeEventListener("mouseover", display_list_profil, false);
			inputs_type[j].removeEventListener("click", display_list_profil);
        }
    }
    console.info("[unbind_inputs]: unbind all corail events from inputs");
}

//Bind all select to change algo
function bind_selects() {
    for (var i = 0; i < selects.length; i++) {
        selects[i].addEventListener('change', changeAlgo, false);
    }
    console.info("[bind_selects]: binding all corail events to selects");
}

//Reverse bind_selects
function unbind_selects() {
    for (var i = 0; i < selects.length; i++) {
        selects[i].removeEventListener('change', changeAlgo, false);
    }
    console.info("[unbind_selects]: unbind all corail events from selects");
}


//Set all input to empty value and no corail design
//Does not act on field not filled by corail
function clear_inputs() {
    var inputs_clear = {};

    //Load inputs
    for (var i = 0; i < type_to_include.length; i++) {
        inputs_clear[type_to_include[i]] = window.document.body.querySelectorAll("input[type=" +
            type_to_include[i] + "]");
    }

    for (var i = 0; i < type_to_include.length; i++) {
        var all_inputs_for_type = inputs_clear[type_to_include[i]];

        for (j = 0; j < all_inputs_for_type.length; j++) {

            //Only clear field if was filled by corail
            if(all_inputs_for_type[j].classList.contains("corail_bg")  ){
                //Don't clear a field which has been manually edit by user
                if(all_inputs_for_type[j].hasAttribute(CODE_FIELD_USER_EDIT)){
                    continue;
                }
                all_inputs_for_type[j].value = "";
                remove_corail_design(all_inputs_for_type[j]);
                all_inputs_for_type[j].removeAttribute(CODE_FILLED_BY_PROFILLESS);
                all_inputs_for_type[j].removeAttribute(CODE_FILLED_BY_PROFIL);
                //Here, don't remove CODE_FIELD_USER_EDIT, if you do the next fill field 
                //will override user value
            }
        }
    }
}

function clear_selects() {
    for (var i = 0; i < selects.length; i++) {
        var select = selects[i];
        //Set defaut first value on select
        select.selectedIndex = 0;
        remove_corail_design(select);
        //Remove any attribute indicating it has been filled
        select.removeAttribute(CODE_FILLED_BY_PROFILLESS);
        select.removeAttribute(CODE_FILLED_BY_PROFIL);
    }
}

//@ENTRY POINT
//Parse page and bind event on field, then try to create key
function init_fields(callback) {
    load_fields(callback);

    //We don't want to bind events if we are on excluded website 
	if( skip_domain.includes(window.location.host)){
		return;
	}
    bind_inputs();
    bind_selects();
    //fetch_all_field();
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
    var old_class_name = input.className;

    //Only apply design once
    if(old_class_name.indexOf("corail_bg") == -1){
        input.className = input.className + " corail_bg";

        //only put image at the right-end if field > 100px width
        if( input.offsetWidth > 100){
            input.className = input.className + " corail_image";
        }
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

//@ENTRY POINT
//Fetch all fields in page, create key - pivot where possible, else empty key
//This function need the domain to exist in website_front_db
function fetch_all_field(callback){

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

    if(callback != undefined){
        callback();
    }
}

/*
Return an object identifing in current page the pivot - value
it could identify, returning an object as below: 
{
    pivot1: value,
    pivot2: value,
    ...
    pivotn: value
}
*/
function create_pivot_value_from_page(){
    var pivot_value_page = {};
    var key_domain = null; 

    //Input field
    for (var i = 0; i < type_to_include.length; i++) {
        var inputs_type = inputs[type_to_include[i]];

        for (j = 0; j < inputs_type.length; j++) {
            key_domain = construit_domaine_cle(inputs_type[j]);
            pivot_referent = website_front_db.get_referent_pivot(window.location.host, key_domain);
            
            //Pivot is know for this field, need to add it
            if (pivot_referent != null && !(is_empty(inputs_type[j])) ){
                if(pivot_referent == CODE_MAIN_EMAIL){
                    pivot_value_page[pivot_referent] = inputs_type[j].value.toLowerCase();
                }else{
                    pivot_value_page[pivot_referent] = inputs_type[j].value.capitalize();
                }
            }
        }
    }

    //Select field
    for (var i = 0; i < selects.length; i++) {
        key_domain = construit_domaine_cle(selects[i]);
        pivot_referent = website_front_db.get_referent_pivot(window.location.host, key_domain);
            
        //Pivot is know for this field, need to add it
        if (pivot_referent != null && !(is_empty(selects[i] ) ) ){
            pivot_value_page[pivot_referent] = selects[i].value.capitalize();
        }
    }
    return pivot_value_page;
}

//Get the proper user value from field, regarding it's type (input/select) 
//and the type of data (email/psd VS classical data)
function get_user_value(field){
	var user_value = null;
	if(field.tagName == "input" || field.tagName == "Input" || field.tagName == "INPUT"){
		user_value = field.value;
	}else if(field.tagName == "select" || field.tagName == "Select" || field.tagName == "SELECT"){
		user_value = field.options[field.selectedIndex].text.replace(" ", "");
	}

	console.debug("Raw user value from field: " + user_value);

	//Don't normalize email or password field
	if (field.type == "email" || check_email(user_value) || field.type == "password") {
		user_value = field.value.toLowerCase();
	}else{
		user_value = user_value.capitalize();
	}

	console.info("Final user value: " + user_value);
	
	return user_value;
}