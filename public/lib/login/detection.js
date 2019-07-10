/*
Projet Corail
Auteur: Benjamin GRASSART
Année: 2019

login/detection.js

V7 functionnality.
Define detection function for find login form in DOM.

*/

var pointer_on_list = false;
var pointer_on_input = false;
//At the beginning, no profil has been chosen (validated)
var profil_validated = false;

//We want this to be global so each function can access
//Also, when using egvent you d'ont have to use "bind"
//bind create many issues because it return a new function, therefore add / remove listenners become impossible
var list_login = null;



/*
    ------------------------------------------------
	First algoritm: form detection based on keywords
	------------------------------------------------

	This algoritm, according to our study works in 70% of cases.
	Basically, what it does is to collect all form in pages and look for key word
	to extract form that could be login form.
	Then, it check if there is inside the form a login and a password field, and no other fields.
	If there are others fields, it is certainly a classic form and not a login form.
	Then it returns the form found. 
*/


//Get number of keyword occurences for form
function nb_keyword_in_form(form, words){
	var nb_occurences = 0;
	
	for( var i=0 ; i<words.length ; i++){
		
		//For some reason, the var of a form are not always a string. Need to check this

		if( form.name !== undefined && (typeof(form.name) === "string" ) ) {
			nb_occurences = nb_occurences + occurrences_in_string(form.name.toLowerCase(), words[i], false);	
		}
		if( form.className !== undefined && (typeof(form.className) === "string" ) ){
			nb_occurences = nb_occurences + occurrences_in_string(form.className.toLowerCase(), words[i], false);	
		}
		if( form.title !== undefined && (typeof(form.title) === "string" ) ){
			nb_occurences = nb_occurences + occurrences_in_string(form.title.toLowerCase(), words[i], false);
		}
		if( form.id !== undefined && (typeof(form.id) === "string" ) ){
			nb_occurences = nb_occurences + occurrences_in_string(form.id.toLowerCase(), words[i], false);	
		}
		if( form.action !== undefined && (typeof(form.action) === "string" ) ){
			nb_occurences = nb_occurences + occurrences_in_string(form.action.toLowerCase(), words[i], false)	
		}

		//Bonus, look in url in all cases :)
		nb_occurences = nb_occurences + occurrences_in_string(window.location.href.toLowerCase(), words[i], false);	
    
	}
	return nb_occurences;
}






// Look for login form in current web page
// Return a list of eligible login form
// Note(BG): on the contrary as I thought, this is not enough 
// to find the good form in all cases. 
// We need to check later on login and password
function get_logins_form(verbose){
	var forms = document.body.querySelectorAll("form");

	var login_form_list = [];
	for (var i = 0; i < forms.length; i++) {
		var current_form = forms[i];

		var keyword_occurence = nb_keyword_in_form(current_form, form_keywords);
		if(verbose == true){
			console.debug("[get_logins_form] Found " + keyword_occurence + " keyword occurence for current form");
		}

		if(keyword_occurence >= keyword_occurence_needed){
			if(verbose == true){
				console.debug("[get_logins_form] Adding in list the login form in page, which is as follow:");
				console.debug("[get_logins_form] Action: " + current_form.action);
				console.debug("[get_logins_form] id / : " + current_form.id + " / " + current_form.name);
			}
			login_form_list.push(current_form);
		}
	}

	if(verbose == true){
		console.info("[get_logins_form] Number of eligible login form found: " + login_form_list.length);
	}
	return login_form_list;
}

//This should always be provided a login form.
//If not, will return false
function get_password_field_from_form(login_form, verbose){
	var password_field = login_form.querySelector("input[type=password]");
	if( password_field == null){
		return false;
	}
	if(verbose == true){
		console.debug("id of password field: " + password_field.id);
		console.debug("name of password field: " + password_field.name);
	}
	
	return password_field;
}

//This should always be provided a login form.
//If not, will return false
function get_login_field_from_form(login_form, verbose){
	//First try to retrieve login field with email field
	var login_field = login_form.querySelector("input[type=email]");

	//Maybe login field is actually a simple text field
	if( login_field == null){
		login_field = login_form.querySelector("input[type=text]");
	}

	if(login_field == null){
		return false;
	}
	if(verbose == true){
		console.debug("id of login field: " + login_field.id);
		console.debug("name of login field: " + login_field.name);
	}
	
	return login_field;
}

//Get the number of field we can find in form. 
function get_number_field_in_form(login_form, verbose){
	var nb = 0;

	for(var i=0 ; i<type_login_form_detection.length ; i++){
		var current_type_login_form = type_login_form_detection[i];

		var current_fields = login_form.querySelectorAll("input[type=" + current_type_login_form + "]");
		if(verbose){
			console.debug("[get_number_field_in_form] We found for type of field " + 
				current_type_login_form + " " + current_fields.length +  " occurences");
		}
		nb += current_fields.length; 
	}
	if(verbose){
		console.debug("[get_number_field_in_form] The total number of fields in form " + 
			login_form.id  + " / " + login_form.name + " / " + login_form.action + " = " + nb);
	}
	return nb;
}

/* Research in current page the login form
   Three conditions: 
  		 - there are forms eligible
 		 - There is a login field
		 - There is a password field

	This function return object:
	{
		form: <login form>,
		login_field: <login field>,
		password_field: <password field>
	}

	Set the global var to share login form and field.
	
	This can be called as a regular task. That's why it has a "verbose" option, to silent it if needed.
*/
function research_and_set_login_form(verbose){
	var forms_list = get_logins_form(verbose);

	for(var i=0 ; i<forms_list.length ; i++){
		var current_form = forms_list[i];

		//This is call in a regular task. Could be too verbose
		if(verbose == true)
			console.info("Analysing form with id / name " + current_form.id + " / " + current_form.name);

		// If there is more than 2 field in the form, it's not a login form
		// Probably a "classical profil form" 
		if(get_number_field_in_form(current_form, verbose) > 2){
			console.debug("There is more than 2 field in form. It's not a login form. Going to next form.");
			continue;
		}

		var current_login = get_login_field_from_form(current_form, verbose);
		var current_password = get_password_field_from_form(current_form, verbose);

		if(verbose == true){
			console.info("current_login: " + current_login);
			console.info("current password: " + current_password);
		}
		

		if(current_login != false && current_password != false){
			console.info("[research_login_form]: Found the login form");
			console.debug("Action: " + current_form.action);
			console.info("id: " + current_form.id);
			console.debug("name: " + current_form.name);

			current_login_form     = current_form;
			current_login_field    = current_login;
			current_password_field = current_password;

			//Nice ES2015 syntax. Looks like Python :)
			return {current_form, current_login, current_password};
		}
	}
	return false;
}

/*
    -------------------------------------------------
	Second algoritm: login / psd standalone detection
	-------------------------------------------------

	This algoritm, according to our study should cover 10-15% missing cases.
	The First algoritm does not work if the form is not properly tagged, or
	worse if there is no form at all (I know, it's bad).

	In this case, we'll try to analyse directly the input available to see if we can detect
	a login and a password field in page.
*/

//Try to find the better login field in page 
function get_login_field_all_page(verbose){
	//Get all input in page with type which could correspond to a login field
	var login_field_list = document.querySelectorAll("input[type=email], input[type=text]");

	console.info("[get_login_field_all_page] Found " + login_field_list.length + " node which could be login field");

	//Try to find the best login candidate
	var max_key_word_found = 0;
	var best_login_field = null;
	
	var current_field_keywork_login = 0;
	var current_field = null;

	for(var i=0 ; i<login_field_list.length ; i++){
		current_field = login_field_list[i];
		console.info("Analysing following node: " + current_field.outerHTML);
		current_field_keyword_found = nb_keyword_in_field(current_field, field_login_keywords , 1);
		console.info("number of keyword found: " + current_field_keyword_found);

		if( current_field_keyword_found > max_key_word_found){
			console.info("[get_login_field_all_page]Found a new best login with nb of keyword: " + current_field_keyword_found);
			max_key_word_found = current_field_keyword_found;
			best_login_field = current_field;
		}
	}

	if(best_login_field != null){
		console.info("[get_login_field_all_page] The best login field we could find is: " 
			+ best_login_field.outerHTML);
	}else{
		console.info("[get_login_field_all_page] Could not find a login field in this page.");
	}

	return best_login_field;
}

function get_password_field_all_page(verbose){
	//Get all input in page with type which could correspond to a login field
	var password_field_list = document.querySelectorAll("input[type=password]");

	console.info("[get_password_field_all_page] Found " + password_field_list.length + " node which could be password field");

	//Try to find the best password candidate
	var max_key_word_found = 0;
	var best_password_field = null;
	
	var current_field_keywork_password = 0;
	var current_field = null;

	for(var i=0 ; i<password_field_list.length ; i++){
		current_field = password_field_list[i];
		console.info("Analysing following node: " + current_field.outerHTML);
		current_field_keyword_found = nb_keyword_in_field(current_field, field_password_keywords , 1);
		console.info("number of keyword found: " + current_field_keyword_found);

		current_field_keyword_found += 1;

		if( current_field_keyword_found > max_key_word_found){
			console.info("[get_password_field_all_page]Found a new best password with nb of keyword: " + current_field_keyword_found);
			max_key_word_found = current_field_keyword_found;
			best_password_field = current_field;
		}
	}

	if(best_password_field != null){
		console.info("[get_password_field_all_page] The best password field we could find is: " 
			+ best_password_field.outerHTML);
	}else{
		console.info("[get_password_field_all_page] Could not find a password field in this page.");
	}

	return best_password_field;
}


/*
    ----------------------------------------
	Event management: Common to all algoritm
	----------------------------------------
*/


function initialise_login_DOM(){
	if(current_login_form != null && current_login_form != undefined){
		console.info("[mark_login_field]: Marking in DOM the following login form");
		console.info("Id: " + current_login_form.id);
	}else{
		console.info("Binding standalone field");
	}

	if(current_login_field != null){
		//Disable futur profil list event binding
		current_login_field.setAttribute(CODE_LOGIN_FIELD, "true");
	}
	
	if(current_password_field != null){
		//Exact same process for password field
		current_password_field.setAttribute(CODE_PASSWORD_FIELD, "true");
	}
}

function bind_login_event(){
	if(current_login_form != null && current_login_form != undefined){
		console.info("[bind_login_event]: Binding in DOM the login event for following form:");
		console.info("Id / name : " + current_login_form.id + " / " + current_login_form.name);
	}else{
		console.info("Binding standalone field");
	}
	//Disable futur profil list event binding, add login event
	current_login_field.removeEventListener("mouseover", display_list_profil, false);
	current_login_field.removeEventListener("click", display_list_profil);
	current_login_field.addEventListener("blur", blur_field_login);

	current_login_field.addEventListener("keydown", function(event) {
		if (event.key === "Enter") {
			blur_field_login();
		}
	});

	//Exact same process for password field
	current_password_field.removeEventListener("mouseover", display_list_profil, false);
	current_password_field.removeEventListener("click", display_list_profil);
	current_password_field.addEventListener("blur", blur_field_login);

	current_password_field.addEventListener("keydown", function(event) {
		if (event.key === "Enter") {
			blur_field_login();
		}
	});
}

function bind_profil_event_login_field(){
	current_login_field.addEventListener("mouseover", display_list_profil, false);
}

