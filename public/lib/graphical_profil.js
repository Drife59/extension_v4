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


//Define event to create lists on input to display profil
function init_event_list() {

	//We absolutely need to position the block at body root, in order 
	//to have the profil list properly positionned.
	//Profil list will have a position absolute, calculated from input position
	var list_profil = buildProfilList();
	window.document.body.appendChild(list_profil)

	for (var i = 0; i < type_to_include.length; i++) {
		var inputs_type = inputs[type_to_include[i]];

		for (j = 0; j < inputs_type.length; j++) {

			//Don't process search field
			if (is_search_field(inputs_type[j])) {
				continue;
			}

			//On hover, create and bind the list
			inputs_type[j].onmouseover = function (evt) {

				var position_current_input1 = getPosition(evt.target);

				//Display list as block, resize and position it
				list_profil.style.display = "block";
				pointer_on_input = true;

				//Same size as the field
				var str_style = "width:" + evt.target.offsetWidth + "px;";
				str_style += "left: " + position_current_input1.x + "px;";
				//Vertical position: original input position + vertical size input + vertical scroll
				str_style += "top: " + (position_current_input1.y + evt.target.offsetHeight + window.scrollY) + "px;";
				str_style += "position: absolute;";

				list_profil.setAttribute("style", str_style);
				console.debug("List position was set to absolute: " + list_profil.style.left + " / " + list_profil.style.top);
			};

			//Hide list if leaving field and pointer is not on list
			inputs_type[j].onmouseout = function (evt) {
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
	for (var id_profil in profil_db.get_profil_for_list()) {

		var opt = document.createElement('a');
		opt.innerHTML = profil_db.get_display_value_string(id_profil);
		opt.setAttribute("profil_id", id_profil);
		opt.href = "#";

		html_list.appendChild(opt);

		//Cannot set listenner here, id_profil will stay in RAM and be the one nfor the last profil
	}

	html_list.onmouseleave = function (evt) {
		html_list.style.display = "none";

		//Iinform all that the list is not fetched anymore
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

	for (var i = 0; i < all_options.length; i++) {
		all_options[i].onmouseover = function (evt) {
			clear_inputs();
			clear_selects();
			fill_fields_v6(evt.target.getAttribute("profil_id"));
		}

		//Bind event to choose a profil
		all_options[i].onclick = function (evt) {
			fill_fields_v6(evt.target.getAttribute("profil_id"));
			profil_id_chosen = evt.target.getAttribute("profil_id");
			profil_db.increase_profil_weight(profil_id_chosen);
			profil_db.decrease_delete_profil();
			console.debug("Profil chosen: " + JSON.stringify(profil_db.profil_values[profil_id_chosen], null, 4));
		}
	}
}