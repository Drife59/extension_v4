/*
Projet Corail
Auteur: Benjamin GRASSART
Année: 2018

OnChange.js

Défini les algoritmes lors de l'évènement onChange,
c'est à dire qu'on détecte que l'utilisateur a mis à jour une valeur.
Cf config manifest.json
*/



//Main algo for event change detected on input field
function changeAlgo(evt){
	var champ = evt.target
	console.log("Algo change: field " + champ.tagName + " modified: " + HtmlEltToString(champ));
	var key_domain = construit_domaine_cle(champ);
	var valeur_utilisateur = champ.value.capitalize();

	//Don't normalize email or password field
	if(champ.type == "email" || check_email(valeur_utilisateur) || champ.type == "password"){
		valeur_utilisateur = champ.value.toLowerCase();
	}

	if( !is_valid_field(champ)){
		console.log("Algo change: cannot identify properly field " + champ.id);
		return;
	}

	//Don't process empty field
	if( is_empty(champ)){
		console.log("Algo change: field is empty, no process.");
		return;
	}

	//Don't process paiement card
	if( check_card(valeur_utilisateur)){
		console.log("Algo change: no process executed for card number " + valeur_utilisateur);
		return;
	}

	//Don't process search field
	if( is_search_field(champ)){
		return;
	}

	//Get current user and launch algo
	chrome.storage.sync.get("current_user", function(data) {
		if( Object.keys(data).length !== 0){

			var domain = window.location.host;

			var key_object     = website_front_db.has_key(domain, key_domain);
			var pivot_referent = website_front_db.get_referent_pivot(domain, key_domain);

            console.info("Processing domain key: " + key_domain);
			console.log("pivot referent = " + pivot_referent);

			//In all the three cases below, we update key pivot weight, using an objecf from user front db
			/* pivot_weight is like below, representing pivot weight, for corresponding user value 
				* {
				*      "nom": "2.3",
				*      "prenom": "4.5"
				* }
			*/
			var pivot_weight = user_front_db.get_pivot_weight_from_values(valeur_utilisateur);
			var pivots_with_values = user_front_db.get_pivot_with_values();

			//Key exist and there is a referent pivot
			if(key_object && website_front_db.get_referent_pivot(domain, key_domain) != null){
				console.info("Pivot referent found: " + pivot_referent);
				user_front_db.change_value_pivot_trouve_domaine(key_domain, pivot_referent, valeur_utilisateur);		
				website_front_db.apply_pivot_on_key(domain, key_domain, pivot_weight, pivots_with_values);
			}
			//Key exist but no pivot referent
			else if(key_object){
				console.log("No pivot referent found");
				//get pivot and weight associated with user value
				website_front_db.apply_pivot_on_key(domain, key_domain, pivot_weight, pivots_with_values);
			}
			//Key does not exist at all
			else{
				console.log("No key at all for domain key, adding it.");
				//heuristic weight is undefined
				website_front_db.create_key(domain, key_domain)
				website_front_db.apply_pivot_on_key(domain, key_domain, pivot_weight, pivots_with_values);

				//Don't add user value for now
				//user_front_db.change_value_pivot_non_trouve_domaine(key_domain, new_pivot, valeur_utilisateur);
			}
		}else{
			console.error("Algo change: Critical cannot find current user. Please log in.");
		}
	});
}
