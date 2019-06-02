/*
Projet Corail
Auteur: Benjamin GRASSART
Année: 2019

login/graphical_profil.js

V7 functionnality.
Define graphical function for login.

*/

var pointer_on_login_list = false;
var pointer_on_input_login = false;
//At the beginning, no profil has been chosen (validated)
var profil_validated = false;

//We want this to be global so each function can access
//Also, when using egvent you d'ont have to use "bind"
//bind create many issues because it return a new function, therefore add / remove listenners become impossible
var list_login = null;


/*
    ---------------------------
	Graphical construction part
	---------------------------
*/

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
	var html_list_login = document.createElement('div');
	html_list_login.id = id_list_login;
	html_list_login.className = "corail_list dropdown-content";


	if(!login_front_db.has_login()){
		console.info("No login for domain: " + login_front_db.domain);
		console.info("Aborting building graphical list of login");
		return null;
	}

	//Build dynamic list from login front db
	var login_list = login_front_db.login_psd;

	for (var i in login_list) {
		var obj_login = login_list[i];
		var opt = document.createElement('a');
		opt.innerHTML = obj_login["login"] + "/" + obj_login["password"];
		opt.setAttribute("login_id", obj_login["login_id"]);
		opt.href = "#";

		html_list_login.appendChild(opt);

		//Cannot set listenner here, id_login will stay in RAM and be the one for the last login
	}

	//Add special option clear
	var opt_clear = document.createElement('a');
	opt_clear.innerHTML = "Clear";
	opt_clear.setAttribute("id", "clear_corail");
	opt_clear.href = "#";
	
	//At first, for hover, don't display clear option
	opt_clear.style.display = "none";
	html_list_login.appendChild(opt_clear);


	html_list_login.onmouseleave = function (evt) {

		//We need to wait a bit, if pointer is back in input
		//So the var pointer_on_input_login has time to be true :)
		setTimeout(function () {
			//If not fetching list, hide it
			if (pointer_on_input_login == false) {
				list_login.style.display = "none";
			}
		}, 50);
		

		//Inform all that the list is not fetched anymore
		pointer_on_login_list = false;
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
	pointer_on_input_login = true;

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


//Entry point for login list management
function init_event_login_list(){
	var result_research_login_form = research_login_form();
	if( result_research_login_form == false){
		console.info("[init_event_login_list] Cannot find a login form, aborting logins event initialisation");
		return false;
	}
	var {current_form:login_form, current_login:login_field, current_password:password_field} = result_research_login_form;

	initialise_login_DOM(login_form, login_field, password_field);

	if(! login_front_db.has_login()){
		console.warn("No login at all for website, cannot initialise login list");
		return false;
	}

	if( login_front_db.has_only_one_login()){
		console.info("Only one login was detected for this domain.");
		console.info("Filling login/psd field within the ones found in login DB.");
		var only_login = login_front_db.get_only_login();
		login_field.value = only_login.login;
		password_field.value = only_login.password;
		return true;
	}
	else{
		console.info("[mark_login_field] Many identifiers available for this domain. Building list");
		list_login = buildLoginList();

		window.document.body.appendChild(list_login)

		//At the first navigation, on hover bind and display the list
		login_field.addEventListener("mouseover", display_list_login);
		login_field.onmouseover = function(){
			pointer_on_login_input = true;
		}
	

		//Hide list if leaving field and pointer is not on list
		login_field.onmouseout = function () {
			pointer_on_login_input = false;

			//We need to wait a bit to allow value pointer_on_login_list to change
			
			setTimeout(function () {
				//If not fetching list, hide it
				if (pointer_on_login_list == false && pointer_on_login_input == false) {
					list_login.style.display = "none";
				}
			}, 50);
			
		}
	}
}