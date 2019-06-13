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
    -------------------------
	Login form detection part
	-------------------------
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
function get_logins_form(){
	var forms = document.body.querySelectorAll("form");

	var login_form_list = [];
	for (var i = 0; i < forms.length; i++) {
		var current_form = forms[i];

		var keyword_occurence = nb_keyword_in_form(current_form, form_keywords);
		console.debug("[get_logins_form] Found " + keyword_occurence + " keyword occurence for current form");
		
		if(keyword_occurence >= keyword_occurence_needed){
			console.debug("[get_logins_form] Adding in list the login form in page, which is as follow:");
			console.debug("[get_logins_form] Action: " + current_form.action);
			console.debug("[get_logins_form] id: " + current_form.id);
			console.debug("[get_logins_form] name: " + current_form.name);

			login_form_list.push(current_form);
		}
	}

	console.info("[get_logins_form] Number of eligible login form found: " + login_form_list.length);
	return login_form_list;
}

//This should always be provided a login form.
//If not, will return false
function get_password_field(login_form){
	var password_field = login_form.querySelector("input[type=password]");
	if( password_field == null){
		return false;
	}
	console.debug("id of password field: " + password_field.id);
	console.debug("name of password field: " + password_field.name);
	return password_field;
}

//This should always be provided a login form.
//If not, will return false
function get_login_field(login_form){
	//First try to retrieve login field with email field
	var login_field = login_form.querySelector("input[type=email]");

	//Maybe login field is actually a simple text field
	if( login_field == null){
		login_field = login_form.querySelector("input[type=text]");
	}

	if(login_field == null){
		return false;
	}
	console.debug("id of login field: " + login_field.id);
	console.debug("name of login field: " + login_field.name);
	return login_field;
}

//Get the number of field we can find in form. 
function get_number_field_in_form(login_form){
	var nb = 0;

	for(var i=0 ; i<type_login_form_detection.length ; i++){
		var current_type_login_form = type_login_form_detection[i];

		var current_fields = login_form.querySelectorAll("input[type=" + current_type_login_form + "]");
		nb += current_fields.length; 
	}
	console.debug("[get_number_field_in_form] The total number of fields in form = " + nb);
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
*/
function research_and_set_login_form(){
	var forms_list = get_logins_form();

	for(var i=0 ; i<forms_list.length ; i++){
		var current_form = forms_list[i];

		// If there is more than 2 field in the form, it's not a login form
		// Probably a "classical profil form" 
		if(get_number_field_in_form(current_form) > 2){
			console.debug("There is more than 2 field in form. It's not a login form. Going to next form.");
			continue;
		}

		var current_login = get_login_field(current_form);
		var current_password = get_password_field(current_form);

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


function initialise_login_DOM(){
	console.info("[mark_login_field]: Marking in DOM the following login form");
	console.info("Id: " + current_login_form.id);

	//Disable futur profil list event binding
	current_login_field.setAttribute(CODE_LOGIN_FIELD, "true");

	//Exact same process for password field
	current_password_field.setAttribute(CODE_PASSWORD_FIELD, "true");
}

function bind_login_event(){
	console.info("[bind_login_event]: Binding in DOM the login event for following form:");
	console.info("Id: " + current_login_form.id);

	//Disable futur profil list event binding, add login event
	current_login_field.removeEventListener("mouseover", display_list_profil, false);
	current_login_field.removeEventListener("click", display_list_profil);
	current_login_field.addEventListener("blur", blur_field_login);

	//Exact same process for password field
	current_password_field.removeEventListener("mouseover", display_list_profil, false);
	current_password_field.removeEventListener("click", display_list_profil);
	current_password_field.addEventListener("blur", blur_field_login);

}
