/*
Projet Corail
Auteur: Benjamin GRASSART
Année: 2019

login/graphical.js

V7 functionnality.
Define graphical function for login.

*/

var pointer_on_login_list = false;
var pointer_on_login_input = false;

var login_id_chosen = null;

//We want this to be global so each function can access
//Also, when using egvent you d'ont have to use "bind"
//bind create many issues because it return a new function, therefore add / remove listenners become impossible
var list_login = null;


/*
    ---------------------------
	Graphical construction part
	---------------------------
*/

function build_DOM_login_list(){
	var html_list_login = document.createElement('div');
	html_list_login.id = id_list_login;
	html_list_login.className = "corail_list";

	//Build dynamic list from login front db
	var login_list = login_front_db.login_psd;

	for (var i in login_list) {
		var obj_login = login_list[i];
		var opt = document.createElement('a');
		opt.innerHTML = obj_login["login"] + "/ ********** ";
		opt.setAttribute("login_id", obj_login["login_id"]);
		opt.href = "#";

		html_list_login.appendChild(opt);
	}
	return html_list_login;
}

function build_DOM_clear_option_login(){
	//Add special option login clear
	var opt_clear = document.createElement('a');
	opt_clear.innerHTML = "Clear";
	opt_clear.setAttribute("id", "clear_corail_login");
	opt_clear.href = "#";
	
	//At first, for hover, don't display clear option
	opt_clear.style.display = "none";

	return opt_clear;
}


/*
Build the list list like below.
Use global var login_front_db

<div class="dropdown-content">
    <a href="#">Link 1</a>
    <a href="#">Link 2</a>
    <a href="#">Link 3</a>
</div>
*/
function buildLoginList() {
	
	if(!login_front_db.has_login()){
		console.info("No login for domain: " + login_front_db.domain);
		console.info("Aborting building graphical list of login");
		return null;
	}

	//First, delete old list if it does exist
	//First, del old list if it was already there
	var old_list_login = document.body.querySelector("div[id=id_login_list]");
	if(old_list_login != null){
		old_list_login.remove();
	}

	var html_list_login = build_DOM_login_list();
	html_list_login.appendChild(build_DOM_clear_option_login());


	html_list_login.onmouseleave = function (evt) {
		//We need to wait a bit, if pointer is back in input
		//So the var pointer_on_login_input has time to be true :)
		setTimeout(function () {
			//If not fetching list, hide it
			if (pointer_on_login_input == false) {
				html_list_login.style.display = "none";
			}
		}, 50);
		

		//Inform all that the list is not fetched anymore
		pointer_on_login_list = false;

		//When leaving list, clearing field
		//Unless a login has been selected
		if( login_id_chosen == null){
			current_login_field.value = "";
			current_password_field.value = "";
		}
	}

	html_list_login.onmouseenter = function (evt) {
		//Inform all that the list is now fetched
		pointer_on_login_list = true;
	}

	html_list_login.onclick = function (evt) {
		//Inform all that the list is now fetched
		pointer_on_login_list = false;
		html_list_login.style.display = "none";
	}

	// By default, the login list will not be displayed
	// It will appear on particular events
	html_list_login.style.display = "none";

	return html_list_login;
}

function display_list_login(){

	//Don't start process for certain domain defined in conf
	if( skip_domain.includes(window.location.host)){
		console.info("Domain " + window.location.host + " is defined to be skipped, don't display login list.");
		return;
	}

	var position_current_input1 = getPosition(this);

	//Display list as block, resize and position it
	list_login.style.display = "block";
	pointer_on_login_input = true;

	//Same size as the field
	var str_style = "width:" + this.offsetWidth + "px;";
	str_style += "left: " + position_current_input1.x + "px;";
	//Vertical position: original input position + vertical size input + vertical scroll
	str_style += "top: " + (position_current_input1.y + this.offsetHeight + window.scrollY) + "px;";
	str_style += "position: absolute;";

	//build_display_list_login(this);

	list_login.setAttribute("style", str_style);
	console.debug("List login position was set to absolute: " + list_login.style.left + " / " + list_login.style.top);
}

//Bind on a login field events to display and manage list 
function init_login_field_event(field){

	//At the first navigation, on hover bind and display the list
	field.addEventListener("mouseover", display_list_login);
	field.onmouseover = function(){
		pointer_on_login_input = true;
	}

	//Hide list if leaving field and pointer is not on list
	field.onmouseout = function () {
		pointer_on_login_input = false;

		//We need to wait a bit to allow value pointer_on_login_list to change
		
		setTimeout(function () {
			//If not fetching list, hide it
			if (pointer_on_login_list == false) {
				list_login.style.display = "none";
			}
		}, 50);			
	}
}


//@ENTRYPOINT
//Entry point for login list management
function init_event_login_list(){
	var result_research_login_form = research_and_set_login_form();
	if( result_research_login_form == false){
		console.info("[init_event_login_list] Cannot find a login form, aborting logins event initialisation");
		return false;
	}
	// Found the login form

	// Don't need this anymore, using global var 
	//var {current_form:login_form, current_login:login_field, current_password:password_field} = result_research_login_form;

	initialise_login_DOM();
	bind_login_event();

	//If there is no login at all, let profil function manage these fields
	if(! login_front_db.has_login()){
		console.info("No login detected for this website. Binding again profil list");
		//Bind again the profil list on the field
		bind_profil_event_login_field();
		return false;
	}

	if( login_front_db.has_only_one_login()){
		console.info("Only one login / psd was found for this domain.");
		console.info("Filling login/psd field within the ones found in login DB.");
		var only_login = login_front_db.get_only_login();

		current_login_field.dispatchEvent(event = new Event('focus'));
		current_password_field.dispatchEvent(event = new Event('focus'));
		current_login_field.value = only_login.login;
		current_password_field.value = only_login.password;

		current_login_field.dispatchEvent(event = new Event('blur'));
		current_password_field.dispatchEvent(event = new Event('blur'));

		current_login_field.dispatchEvent(event = new Event('input'));
		current_password_field.dispatchEvent(event = new Event('input'));	
		
		
		return true;
	}
	else{
		console.info("[mark_login_field] Many identifiers available for this domain. Building list");
		list_login = buildLoginList();

		window.document.body.appendChild(list_login);

		init_login_field_event(current_login_field);
		init_login_field_event(current_password_field);
	}
	bind_listenner_login();
}

//Get from DB the current login object corresponding to login id
function get_current_login_from_list(evt){
	var current_login_id = evt.target.getAttribute("login_id");
	if(current_login_id == null){
		current_login_id = evt.target.getAttribute("login_id");
	}
	var current_login = login_front_db.get_login_by_id(current_login_id);
	return current_login;
}

function bind_listenner_login() {
	var all_options = document.body.querySelectorAll("a[login_id]");
	var opt_clear = document.body.querySelector("a#clear_corail");

	for (var i = 0; i < all_options.length; i++) {
		
		
		//Bind event to preselect a login
		all_options[i].onmouseover = function (evt) {
			var current_login = get_current_login_from_list(evt);
			// Simulate that the value change has been made by a user.
    		// This can be usefull for some form, to improve user experience
    		// Example: minify label, delete placeholder, etc  
			current_login_field.dispatchEvent(event = new Event('focus'));
			current_password_field.dispatchEvent(event = new Event('focus'));		
			current_login_field.value    = current_login["login"];
			current_password_field.value = current_login["password"];
			current_login_field.dispatchEvent(event = new Event('blur'));
			current_password_field.dispatchEvent(event = new Event('blur'));

			current_login_field.dispatchEvent(event = new Event('input'));
			current_password_field.dispatchEvent(event = new Event('input'));		
		}

		//Bind event to choose a login
		all_options[i].onclick = function (evt) {
			var current_login = get_current_login_from_list(evt);	

			console.debug("Login chosen: " + JSON.stringify(current_login, null, 4));

			//Inform all that a login has been chosen
			login_id_chosen = current_login.login_id;

			//now displaying clear option
			opt_clear.style.display = "block";
			//click_for_display_list_login();
			//Don't scroll vertically to the top
			evt.preventDefault();
		}

		//Don't display any value when hover clear option
		opt_clear.onmouseover = function (evt) {
			current_login_field.value    = "";
			current_password_field.value = "";
		}
		
		opt_clear.onclick = function (evt) {
			console.info("Clearing login");
			current_login_field.value    = "";
			current_password_field.value = "";
			//Don't scroll vertically to the top
			evt.preventDefault();

			//All clear, now hide option 'till the next login validation
			opt_clear.style.display = "hidden";
		}

	}
}