/*
Projet Corail
Auteur: Benjamin GRASSART
Année: 2019

graphical_profil.js

V6 functionnality.
Define graphical function for profil.

*/

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
				console.debug("Position of the current input (1). x: " + position_current_input1.x + " y: " + position_current_input1.y);

				//Display list as block, resize and position it
				list_profil.style.display = "block";

				//Same size as the field
				var str_style = "width:" + evt.target.offsetWidth + "px;";
				str_style += "left: " + position_current_input1.x + "px;";
				//Vertical position: original input position + vertical size input + vertical scroll
				str_style += "top: " + (position_current_input1.y + evt.target.offsetHeight + window.scrollY) + "px;";
				str_style += "position: absolute;";

				list_profil.setAttribute("style", str_style);
				console.debug("List position was set to absolute: " + list_profil.style.left + " / " + list_profil.style.top);
			};
		}
	}
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
	for (var id_profil in profil_db.profil_values) {

	}
	var opt = document.createElement('a');
	opt.innerHTML = profil_db.get_display_value_string(4);
	opt.setAttribute("profil_id", 4);
	opt.href = "#";

	opt.onmouseover = function (evt) {
		console.log("Préaffichage du profil " + 4 + " : opt.value");
		fill_fields_v6(4);
	}

	opt.onclick = function (evt) {
		console.log("choix du profil " + 4 + " : " + opt.innerHTML);
	}

	html_list.onmouseleave = function (evt) {
		console.log("leave list");
		html_list.style.display = "none";
		clear_inputs();
	}

	html_list.appendChild(opt);

	return html_list;
}