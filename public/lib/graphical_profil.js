/*
Projet Corail
Auteur: Benjamin GRASSART
Année: 2019

graphical_profil.js

V6 functionnality.
Define graphical function for profil.

*/

var pointer_on_list = false;
var pointer_on_input = false;
//At the beginning, no profil has been chosen (validated)
var profil_validated = false;

//We want this to be global so each function can access
//Also, when using egvent you d'ont have to use "bind"
//bind create many issues because it return a new function, therefore add / remove listenners become impossible
var list_profil = null;

//https://www.kirupa.com/html5/get_element_position_using_javascript.htm
//Return absolute position of en element
function getPosition(el) {
	var xPos = 0;
	var yPos = 0;

	while (el) {
		if (el.tagName == "BODY") {
			// deal with browser quirks with body/window/document and page scroll
			var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
			var yScroll = el.scrollTop || document.documentElement.scrollTop;

			xPos += (el.offsetLeft - xScroll + el.clientLeft);
			yPos += (el.offsetTop - yScroll + el.clientTop);
		} else {
			// for all other non-BODY elements
			xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
			yPos += (el.offsetTop - el.scrollTop + el.clientTop);
		}

		el = el.offsetParent;
	}
	return {
		x: xPos,
		y: yPos
	};
}

//Build a dynamic content for the profil list, 
//to be consistent with the type of input
//For example, display address if field is with pivot main_full_address
function build_display_list(input){
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

function display_list(){
	var position_current_input1 = getPosition(this);

	//Display list as block, resize and position it
	list_profil.style.display = "block";
	pointer_on_input = true;

	//Same size as the field
	var str_style = "width:" + this.offsetWidth + "px;";
	str_style += "left: " + position_current_input1.x + "px;";
	//Vertical position: original input position + vertical size input + vertical scroll
	str_style += "top: " + (position_current_input1.y + this.offsetHeight + window.scrollY) + "px;";
	str_style += "position: absolute;";

	build_display_list(this);

	list_profil.setAttribute("style", str_style);
	console.debug("List position was set to absolute: " + list_profil.style.left + " / " + list_profil.style.top);
}

// Disable mousehover event on input to display list of profil
// Activate instead event click to display list of profil
function click_for_display_list(){
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
			inputs_type[j].removeEventListener("mouseover", display_list, false);
			inputs_type[j].addEventListener("click", display_list);
		}
	}
}

//Define event to create lists on input to display profil
function init_event_list() {

	//We absolutely need to position the block at body root, in order 
	//to have the profil list properly positionned.
	//Profil list will have a position absolute, calculated from input position
	list_profil = buildProfilList();
	//Wait to display the list that it is ready
	list_profil.style.display = "none";

	window.document.body.appendChild(list_profil)

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

			//At the first navigation, on hover bind and display the list
			inputs_type[j].addEventListener("mouseover", display_list);
			inputs_type[j].onmouseover = function(){
				pointer_on_input = true;
			}
		

			//Hide list if leaving field and pointer is not on list
			inputs_type[j].onmouseout = function () {
				pointer_on_input = false;

				//We need to wait a bit to allow value pointer_on_list to change
				setTimeout(function () {
					//If not fetching list, hide it
					if (pointer_on_list == false && pointer_on_input == false) {
						list_profil.style.display = "none";
					}
				}, 50);
				
			}
		}
	}
	bindListenner();
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
	var html_list = document.createElement('div');
	html_list.id = id_list;
	html_list.className = "dropdown-content";

	//Build dynamic list from profil front db
	//List is ordered by weight, DESC
	var profil_list = profil_db.get_profil_for_list();

	for (var i in profil_list) {
		var obj_profil = profil_list[i];
		var opt = document.createElement('a');
		opt.innerHTML = profil_db.get_display_value_string(obj_profil["id_profil"]);
		opt.setAttribute("profil_id", obj_profil["id_profil"]);
		opt.href = "#";

		html_list.appendChild(opt);

		//Cannot set listenner here, id_profil will stay in RAM and be the one for the last profil
	}

	//Add special option clear
	var opt_clear = document.createElement('a');
	opt_clear.innerHTML = "Clear";
	opt_clear.setAttribute("id", "clear_corail");
	opt_clear.href = "#";
	
	//At first, for hover, don't display clear option
	opt_clear.style.display = "none";
	html_list.appendChild(opt_clear);


	html_list.onmouseleave = function (evt) {

		//We need to wait a bit, if pointer is back in input
		//So the var pointer_on_input has time to be true :)
		setTimeout(function () {
			//If not fetching list, hide it
			if (pointer_on_input == false) {
				list_profil.style.display = "none";
			}
		}, 50);

		//Inform all that the list is not fetched anymore
		pointer_on_list = false;

		//A profil has been selected, don't clear field
		if( profil_id_chosen == null){
			clear_inputs();
			clear_selects();
		}
	}

	html_list.onmouseenter = function (evt) {
		//Inform all that the list is now fetched
		pointer_on_list = true;
	}

	html_list.onclick = function (evt) {
		//Inform all that the list is now fetched
		pointer_on_list = false;
		html_list.style.display = "none";
	}

	return html_list;
}


//This cannot be done in main loop of buildProfilList
function bindListenner() {
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
			click_for_display_list();
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
		}

	}
}