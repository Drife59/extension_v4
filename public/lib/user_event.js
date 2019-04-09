/*
Projet Corail
Auteur: Benjamin GRASSART
Année: 2018

OnChange.js

Défini les algoritmes lors de l'évènement onChange,
c'est à dire qu'on détecte que l'utilisateur a mis à jour une valeur.
Cf config manifest.json
*/

function ChangeProfilless(key_domain, user_value) {
	//Get current user and launch algo
	chrome.storage.sync.get("current_user", function (data) {
		if (Object.keys(data).length !== 0) {

			var domain = window.location.host;

			var key_object = website_front_db.has_key(domain, key_domain);
			var pivot_referent = website_front_db.get_referent_pivot(domain, key_domain);

			console.info("Processing domain key: " + key_domain);
			console.debug("pivot referent = " + pivot_referent);

			//In all the three cases below, we update key pivot weight, using an objecf from user front db
			/* pivot_weight is like below, representing pivot weight, for corresponding user value 
				* {
				*      "nom": "2.3",
				*      "prenom": "4.5"
				* }
			*/
			var pivot_weight = user_front_db.get_pivot_weight_from_values(user_value);
			var pivots_with_values = user_front_db.get_pivot_with_values();

			//Key exist and there is a referent pivot
			if (key_object && website_front_db.get_referent_pivot(domain, key_domain) != null) {
				console.info("Pivot referent found: " + pivot_referent);
				var weight_pivot_referent = website_front_db.get_weight_pivot(domain, key_domain, pivot_referent);
				console.debug("Weight for pivot referent: " + weight_pivot_referent);
				user_front_db.change_value_pivot_trouve_domaine(key_domain, pivot_referent, user_value, weight_pivot_referent);
				website_front_db.apply_pivot_on_key_profilless(domain, key_domain, pivot_weight, pivots_with_values);
			}
			//Key exist but no pivot referent
			else if (key_object) {
				console.debug("No pivot referent found");
				//get pivot and weight associated with user value
				website_front_db.apply_pivot_on_key_profilless(domain, key_domain, pivot_weight, pivots_with_values);
			}
			//Key does not exist at all
			else {
				console.debug("No key at all for domain key, adding it.");
				//heuristic weight is undefined
				website_front_db.create_key(domain, key_domain)
				website_front_db.apply_pivot_on_key_profilless(domain, key_domain, pivot_weight, pivots_with_values);

				//Don't add user value for now
				//user_front_db.change_value_pivot_non_trouve_domaine(key_domain, new_pivot, user_value);
			}
		} else {
			console.error("Algo change: Critical cannot find current user. Please log in.");
		}
	});
}

/*
  ---------------------
  V6 algo on user input
  ---------------------
*/

function check_profil_creation(profil_used, key_domain, user_value){
	console.info("Analysing if a new profil needs to be created");

	var referent_pivot = website_front_db.get_referent_pivot(window.location.host, key_domain);

	//This should not hapenned, but if profil is missing this value, just add it
	if(profil_db.get_value_for_pivot(profil_used, referent_pivot) == false){
		console.info("Pivot " + referent_pivot + " has no value in profil, adding it");
		profil_db.add_value_to_profil(current_user, referent_pivot, user_value, profil_used);
	}

	//Create a clone of the profil used by user
	var clone_profil = JSON.parse(JSON.stringify(profil_db.profil_values[profil_used]));
	clone_profil[referent_pivot]["valueText"] = user_value;

	console.info("Clone content: " + JSON.stringify(clone_profil, null, 4));
	
	//TODO continue
	if(profil_db.check_profil_existence(clone_profil) == true){
		console.info("Profil already exist, don't create it again");
	}
	else{
		console.info("Profil does not exist, creating it");
	}

}

function analyse_user_input_field_with_pivot(input, user_value, key_domain) {
	var profil_used = input.getAttribute(CODE_FILLED_BY_PROFIL);

	var pivots_new_value = profil_db.look_for_value_in_profil(profil_used, user_value)

	//First possibility: one or more pivot corresponding to new value in profil used
	if (pivots_new_value.length > 0) {
		console.info("Found some pivot in current profil " + profil_used + " for value " + pivots_new_value);
		console.info("Updating weight with following pivots found: " + JSON.stringify(pivots_new_value));
		website_front_db.update_weight_pivot_list(window.location.host, key_domain, pivots_new_value);
		return;
	}

	//Second possibility: on or more pivot found in other profil
	console.info("Cannot find pivots for value " + user_value + " in current profil.");
	console.info("Looking into other profil");
	var pivots_coeff = profil_db.look_for_value_all_profil(user_value);
	if (Object.keys(pivots_coeff).length > 0) {
		website_front_db.update_weight_coeff_pivot(window.location.host, key_domain,
			pivots_coeff, weight_profil_filled_pivot_known);

		//As the new value if not present in selected profil, we need to check for profil creation
		check_profil_creation(profil_used, key_domain, user_value);
		return;
	}

	//Third possibility: no pivot corresponding at all, unknown value
	console.info("Value is unknown in all user profil");
	var pivot_reference = website_front_db.get_referent_pivot(window.location.host, key_domain);
	if (pivot_reference != null) {
		console.info("Pivot " + pivot_reference + " is still valid for input");
		check_profil_creation(profil_used, key_domain, user_value);
	}
	else {
		console.info("Pivot referent not valid anymore, end of process");
	}
}

//Main algo for event change detected on input field
function changeAlgo(evt) {
	var input = evt.target
	console.info("Algo change: field " + input.tagName + " modified: " + HtmlEltToString(input));
	var key_domain = construit_domaine_cle(input);
	var user_value = input.value.capitalize();

	//Don't normalize email or password field
	if (input.type == "email" || check_email(user_value) || input.type == "password") {
		user_value = input.value.toLowerCase();
	}

	if (!is_valid_field(input)) {
		console.debug("Algo change: cannot identify properly field " + input.id);
		return;
	}

	//Don't process paiement card
	if (check_card(user_value)) {
		console.debug("Algo change: no process executed for card number " + user_value);
		return;
	}

	//Don't process search field
	if (is_search_field(input)) {
		return;
	}

	//We want to execute "analyse_user_input_field_with_pivot" only once
	//The function is also executed on "blur" event, if field has been cleared
	//So we need to execute it only if field has not been cleared
	//This correspond to the case of a "partial" modification of a value

	if (input.hasAttribute(CODE_FILLED_BY_PROFIL) &&
		!(input.hasAttribute(CODE_FIELD_CLEARED_USER))) {
		analyse_user_input_field_with_pivot(input, user_value, key_domain);
	}

	//This part correspond to a manual filling 
	if (!input.hasAttribute(CODE_FILLED_BY_PROFIL)) {
		var referent_pivot = website_front_db.get_referent_pivot(window.location.host, key_domain);

		//Manual filling, but on an input with a referent pivot 
		if (referent_pivot != null) {
			console.info("Manual filling on field with referent pivot: " + referent_pivot);

			var pivots_coeff = profil_db.look_for_value_all_profil(user_value);
			if (Object.keys(pivots_coeff).length > 0) {
				
				website_front_db.update_weight_coeff_pivot(window.location.host, key_domain,
					pivots_coeff, weight_manual_filling_pivot_known);
			}

			//A profil has been chosen before. So we need to add this new value to the profil
			if(profil_id_chosen != null && (liste_pivots_profil.includes(referent_pivot))){
				console.info("Profil " + profil_id_chosen + " has been chosen before.");
				console.info("Adding value " + user_value + " to it");
				profil_db.add_value_to_profil(current_user, referent_pivot, user_value, profil_id_chosen)
			}
		}
		//Anonymous field, with no pivot associated for now
		else {
			console.info("Manual filling on a anonymous field, look for value in all profils");

			var pivots_coeff = profil_db.look_for_value_all_profil(user_value);
			if (Object.keys(pivots_coeff).length > 0) {
				console.info("Found pivot corresponding to value in profil");
				website_front_db.update_weight_coeff_pivot(window.location.host, key_domain,
					pivots_coeff, weight_profil_filled_pivot_known);
				return;
			}else{
				console.info("Cannot find value in profil, executing onChange profilless");
				ChangeProfilless(key_domain, user_value);
			}
		}
	}

	//V5 Process
	if (input.hasAttribute(CODE_FILLED_BY_PROFILLESS)) {
		//Don't process empty field
		if (is_empty(input)) {
			console.debug("Algo change profilless: field is empty, no process.");
			return;
		}
		ChangeProfilless(key_domain, user_value);
	}
}

function blurAlgo(evt) {
	var input = evt.target

	//Process only if a profil has been selected 
	if (input.hasAttribute(CODE_FILLED_BY_PROFIL)) {
		console.info("Event blur: field " + input.tagName + " lost focus: " + HtmlEltToString(input));
		var key_domain = construit_domaine_cle(input);
		var user_value = input.value.capitalize();

		//Field was filled by profil then cleared by user then a new value was entered
		if (input.hasAttribute(CODE_FIELD_CLEARED_USER)) {
			analyse_user_input_field_with_pivot(input, user_value, key_domain);
		}
	}
}

//Algo corresponding to "input" event
//Input event occurs everytime a user modify value on field
function inputAlgo(evt) {
	var input = evt.target
	var key_domain = construit_domaine_cle(input);

	if (input.hasAttribute(CODE_FILLED_BY_PROFIL)) {
		//Field has been cleared
		if (is_empty(input)) {
			console.warn("Algo change profil: field has been cleared, decreasing pivot reference.");
			var pivot_reference = website_front_db.get_referent_pivot(window.location.host, key_domain);
			website_front_db.update_weight_clearing_field(window.location.host, key_domain, pivot_reference);
			input.setAttribute(CODE_FIELD_CLEARED_USER, "true");
		}
	}
}
