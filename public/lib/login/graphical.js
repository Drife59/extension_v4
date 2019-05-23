/*
Projet Corail
Auteur: Benjamin GRASSART
Année: 2019

login/graphical_profil.js

V7 functionnality.
Define graphical function for login.

*/

var pointer_on_list = false;
var pointer_on_input = false;
//At the beginning, no profil has been chosen (validated)
var profil_validated = false;

//We want this to be global so each function can access
//Also, when using egvent you d'ont have to use "bind"
//bind create many issues because it return a new function, therefore add / remove listenners become impossible
var list_profil = null;


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


//Look for login form in current web page
function get_login_form(){
	var forms = document.body.querySelectorAll("form");

	var login_form = null;
	for (var i = 0; i < forms.length; i++) {
		var current_form = forms[i];
		var id_form = current_form.getAttribute("id");
		var name_form = current_form.getAttribute("name");
		var action_form = current_form.getAttribute("action");

		var keyword_occurence = nb_keyword_in_form(current_form, form_keywords);
		console.info("Found " + keyword_occurence + " keyword occurence for current form");
		
		if(keyword_occurence >= keyword_occurence_needed){
			console.info("Found the login form in page");
			console.info("Action: " + action_form);
			console.info("id: " + id_form);
			console.info("name: " + name_form);
			return current_form;
		}
	}
	return false;
}

//This should always be provided a login form.
//If not, will return false
function get_password_field(login_form){
	var password_field = login_form.querySelector("input[type=password]");
	if( password_field == null){
		console.warn("get_password_field: cannot find password field in provided form");
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
		console.warn("Cannot find login field in provided form");
		return false;
	}
	console.info("id of login field: " + login_field.id);
	console.info("name of login field: " + login_field.name);
	return login_field;
}

