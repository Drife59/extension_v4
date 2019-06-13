/*
Projet Corail
Auteur: Benjamin GRASSART
Année: 2019

graphical_profil.js

V6 functionnality.
Define graphical function for profil.

*/

var pointer_on_list_profil = false;
var pointer_on_input_profil = false;
//At the beginning, no profil has been chosen (validated)
var profil_validated = false;

//We want this to be global so each function can access
//Also, when using egvent you d'ont have to use "bind"
//bind create many issues because it return a new function, therefore add / remove listenners become impossible
var list_profil = null;


//Build a dynamic content for the profil list, 
//to be consistent with the type of input
//For example, display address if field is with pivot main_full_address
function build_display_list_profil(input){
	var key_domain = construit_domaine_cle(input);
	var pivot_referent = website_front_db.get_referent_pivot_restitution(window.location.host, key_domain);
	
	console.log("pivot de reference trouve: " + pivot_referent);


	//We have the pivot we shoud show on display 
	//Now let's modify each option accordingly
	var options = list_profil.childNodes;

	for (var i = 0; i < options.length; i++) {

		//Don't update innerHTML for clear option 
		if( !(options[i].hasAttribute("profil_id") ) ){
			continue;
		}
		//By default, display option (profil), will hide it later on needed
		options[i].style.display = "block";

		profil_id = options[i].getAttribute("profil_id");

		var pertinent_value = profil_db.get_value_for_pivot(profil_id, pivot_referent);
		
		//Could not find value in profil. Look in profilless value
		if(pertinent_value == false){
			if(user_front_db.has_value_for_pivot(pivot_referent)){
				pertinent_value = user_front_db.get_value_highest_weigth(pivot_referent);
			}
			//Could not find value nor in profil ou profilless. Hide this profil for input
			else{
				console.info("Cannot find value for pivot " + pivot_referent + " in profil " + profil_id);
				console.info("Hidding this profil for this field");
				pertinent_value = null;
				options[i].style.display = "none";
			}
		}

		if(pertinent_value != null){
			options[i].innerHTML = pertinent_value + "\n" + profil_db.get_value_for_pivot(profil_id, CODE_MAIN_EMAIL);
		}
	}
}

function display_list_profil(){

	//Don't start process for certain domain defined in conf
	if( skip_domain.includes(window.location.host)){
		console.info("Domain " + window.location.host + " is defined to be skipped, don't display list.");
		return;
	}

	var position_current_input1 = getPosition(this);

	//Display list as block, resize and position it
	list_profil.style.display = "block";
	pointer_on_input_profil = true;

	//Same size as the field
	var str_style = "width:" + this.offsetWidth + "px;";
	str_style += "left: " + position_current_input1.x + "px;";
	//Vertical position: original input position + vertical size input + vertical scroll
	str_style += "top: " + (position_current_input1.y + this.offsetHeight + window.scrollY) + "px;";
	str_style += "position: absolute;";

	build_display_list_profil(this);

	list_profil.setAttribute("style", str_style);
	console.debug("List position was set to absolute: " + list_profil.style.left + " / " + list_profil.style.top);
}

// Disable mousehover event on input to display list of profil
// Activate instead event click to display list of profil
function click_for_display_list_profil(){
	for (var i = 0; i < type_to_include.length; i++) {
		var inputs_type = inputs[type_to_include[i]];
		

		for (j = 0; j < inputs_type.length; j++) {
			//Don't process search field
			if (is_search_field(inputs_type[j])) {
				continue;
			}
			
			var key_domain = construit_domaine_cle(inputs_type[j]);

			//Don't display profil list if field cannot be filled
			if( website_front_db.get_referent_pivot_restitution(window.location.host, key_domain) == null){
				continue;
			}

			//Don't forget to remove these listenner in inputs.js "unbind_input"
			inputs_type[j].removeEventListener("mouseover", display_list_profil, false);
			inputs_type[j].addEventListener("click", display_list_profil);
		}
	}
}

//Entry point
//Define event to create lists on input to display profil
function init_event_list_profil() {

	//We don't want to init anything if we are on excluded website 
	if( skip_domain.includes(window.location.host)){
		return;
	}

	//We absolutely need to position the block at body root, in order 
	//to have the profil list properly positionned.
	//Profil list will have a position absolute, calculated from input position
	list_profil = buildProfilList();
	//Wait to display the list that it is ready
	list_profil.style.display = "none";

	//First, del old list if it was already there
	var old_list_profil = document.body.querySelector("div[id=list_profil]");
	if(old_list_profil != null){
		old_list_profil.remove();
	}

	window.document.body.appendChild(list_profil)

	for (var i = 0; i < type_to_include.length; i++) {
		var inputs_type = inputs[type_to_include[i]];

		for (j = 0; j < inputs_type.length; j++) {

			//Don't process search field
			if (is_search_field(inputs_type[j])) {
				continue;
			}

			/* The 2 if below are needed but are not enough.
				if login parsing (to detect login form) run before
				profil parsing, this will prevent from displaying profil list on these field.
				The other case is managed by login parsing, it disable
				profil list events if set on field.
			*/

			//Don't process login form field
			//These fields need to be managed by dedicated login process
			if (is_login_field(inputs_type[j])) {
				continue;
			}

			//Don't process password form field
			//These fields need to be managed by dedicated login process
			if (is_password_field(inputs_type[j])) {
				continue;
			}

			var key_domain = construit_domaine_cle(inputs_type[j]);

			//Don't display profil list if field cannot be filled
			if( website_front_db.get_referent_pivot_restitution(window.location.host, key_domain) == null){
				continue;
			} 

			//At the first navigation, on hover bind and display the list
			inputs_type[j].addEventListener("mouseover", display_list_profil);
			inputs_type[j].onmouseover = function(){
				pointer_on_input_profil = true;
			}
		

			//Hide list if leaving field and pointer is not on list
			inputs_type[j].onmouseout = function () {
				pointer_on_input_profil = false;

				//We need to wait a bit to allow value pointer_on_list_profil to change
				setTimeout(function () {
					//If not fetching list, hide it
					if (pointer_on_list_profil == false && pointer_on_input_profil == false) {
						list_profil.style.display = "none";
					}
				}, 50);
				
			}
		}
	}
	bind_listenner_profil();
}



/*
Build the profil list like below.
Use global var profil_db

<div class="dropdown-content">
    <a href="#">Link 1</a>
    <a href="#">Link 2</a>
    <a href="#">Link 3</a>
</div>
*/
function buildProfilList() {
	var html_list_profil = document.createElement('div');
	html_list_profil.id = id_list;
	html_list_profil.className = "corail_list";

	//Build dynamic list from profil front db
	//List is ordered by weight, DESC
	var profil_list = profil_db.get_profil_for_list();

	for (var i in profil_list) {
		var obj_profil = profil_list[i];
		var opt = document.createElement('a');
		opt.innerHTML = profil_db.get_display_value_string(obj_profil["id_profil"]);
		opt.setAttribute("profil_id", obj_profil["id_profil"]);
		opt.href = "#";

		html_list_profil.appendChild(opt);

		//Cannot set listenner here, id_profil will stay in RAM and be the one for the last profil
	}

	//Add special option clear
	var opt_clear = document.createElement('a');
	opt_clear.innerHTML = "Clear";
	opt_clear.setAttribute("id", "clear_corail");
	opt_clear.href = "#";
	
	//At first, for hover, don't display clear option
	opt_clear.style.display = "none";
	html_list_profil.appendChild(opt_clear);


	html_list_profil.onmouseleave = function (evt) {

		//We need to wait a bit, if pointer is back in input
		//So the var pointer_on_input_profil has time to be true :)
		setTimeout(function () {
			//If not fetching list, hide it
			if (pointer_on_input_profil == false) {
				list_profil.style.display = "none";
			}
		}, 50);

		//Inform all that the list is not fetched anymore
		pointer_on_list_profil = false;

		//A profil has been selected, don't clear field
		if( profil_id_chosen == null){
			clear_inputs();
			clear_selects();
		}
	}

	html_list_profil.onmouseenter = function (evt) {
		//Inform all that the list is now fetched
		pointer_on_list_profil = true;
	}

	html_list_profil.onclick = function (evt) {
		//Inform all that the list is now fetched
		pointer_on_list_profil = false;
		html_list_profil.style.display = "none";
	}

	return html_list_profil;
}


//This cannot be done in main loop of buildProfilList
function bind_listenner_profil() {
	var all_options = document.body.querySelectorAll("a[profil_id]");
	var opt_clear = document.body.querySelector("a#clear_corail");

	for (var i = 0; i < all_options.length; i++) {
		all_options[i].onmouseover = function (evt) {
			clear_inputs();
			clear_selects();
			
			var profil_id = evt.target.getAttribute("profil_id");
			if(profil_id == null){
				profil_id = evt.target.getAttribute("profil_id");
			}
			fill_fields_v6(profil_id, false, false);
		}

		//Bind event to choose a profil
		all_options[i].onclick = function (evt) {
			fill_fields_v6(evt.target.getAttribute("profil_id"), true, true);
			profil_id_chosen = evt.target.getAttribute("profil_id");
			profil_db.increase_profil_weight(profil_id_chosen);
			profil_db.decrease_delete_profil();
			console.debug("Profil chosen: " + JSON.stringify(profil_db.profil_values[profil_id_chosen], null, 4));

			//now displaying clear option
			opt_clear.style.display = "block";
			click_for_display_list_profil();
			//Don't scroll vertically to the top
			evt.preventDefault();
		}

		//Don't display any value when hover clear option
		opt_clear.onmouseover = function (evt) {
			clear_inputs();
			clear_selects();
		}
		
		opt_clear.onclick = function (evt) {
			console.info("Clearing all fields, clearing profil");
			clear_inputs();
			clear_selects();
			//Don't scroll vertically to the top
			evt.preventDefault();

			//All clear, now hide option 'till the next profil validation
			opt_clear.style.display = "hidden";

			//Finally, decrease all weights for all inputs
			var keys = [];
			for (var i = 0; i < type_to_include.length; i++) {
				var inputs_type = inputs[type_to_include[i]];
		
				for (j = 0; j < inputs_type.length; j++) {
					keys.push(construit_domaine_cle(inputs_type[j]));
				}
			}
			website_front_db.update_weight_clearing_all_fields(window.location.host, keys);
		}

	}
}