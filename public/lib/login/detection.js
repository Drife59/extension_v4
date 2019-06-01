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
		
		if( form.name !== undefined){
			nb_occurences = nb_occurences + occurrences_in_string(form.name.toLowerCase(), words[i], false);	
		}
		if( form.className !== undefined ){
			nb_occurences = nb_occurences + occurrences_in_string(form.className.toLowerCase(), words[i], false);	
		}
		if( form.title !== undefined ){
			nb_occurences = nb_occurences + occurrences_in_string(form.title.toLowerCase(), words[i], false);
		}
		if( form.id !== undefined ){
			nb_occurences = nb_occurences + occurrences_in_string(form.id.toLowerCase(), words[i], false);	
		}
		//For some reason, action is not always a string. Need to check this
		if( form.action !== undefined && typeof(form.action) == "string"){
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
	console.info("id of password field: " + password_field.id);
	console.info("name of password field: " + password_field.name);
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
	console.info("id of login field: " + login_field.id);
	console.info("name of login field: " + login_field.name);
	return login_field;
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
*/
function research_login_form(){
	var forms_list = get_logins_form();

	for(var i=0 ; i<forms_list.length ; i++){
		var current_form = forms_list[i];

		var current_login = get_login_field(current_form);
		var current_password = get_password_field(current_form);

		if(current_login != false && current_password != false){
			console.info("[research_login_form]: Found the login form");
			console.debug("Action: " + current_form.action);
			console.info("id: " + current_form.id);
			console.debug("name: " + current_form.name);

			//Nice ES2015 syntax. Looks like Python :)
			return {current_form, current_login, current_password};
		}
	}
	return false;
}


function initialise_login_DOM(login_form, login_field, password_field){
	console.info("[mark_login_field]: Marking in DOM the following login form");
	console.info("Id: " + login_form.id);

	login_field.value = "login_detected";
	//Disable futur profil list event binding
	login_field.setAttribute(CODE_LOGIN_FIELD, "true");
	//But we still need to disable any previous binding
	login_field.removeEventListener("mouseover", display_list_profil, false);
	login_field.removeEventListener("click", display_list_profil);

	//Exact same process for password field
	password_field.value = "password_detected";
	password_field.setAttribute(CODE_PASSWORD_FIELD, "true");
	password_field.removeEventListener("mouseover", display_list_profil, false);
	password_field.removeEventListener("click", display_list_profil);
}

