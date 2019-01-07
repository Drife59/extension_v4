/*
Projet Corail
Auteur: Benjamin GRASSART
Année: 2018

OnChange.js

Défini les algoritmes lors de l'évènement onChange,
c'est à dire qu'on détecte que l'utilisateur a mis à jour une valeur.
Cf config manifest.json
*/

var OnChangeLogger = new Logger(CODE_CHANGE);



//Main algo for event change detected on input field
function changeAlgo(evt){
	var champ = evt.target
	OnChangeLogger.log("Algo change: field " + champ.tagName + " modified: " + HtmlEltToString(champ));
	var key_domain = construit_domaine_cle(champ);
	var valeur_utilisateur = champ.value.capitalize();

	//Don't normalize email or password field
	if(champ.type == "email" || check_email(valeur_utilisateur) || champ.type == "password"){
		valeur_utilisateur = champ.value.toLowerCase();
	}

	if( !is_valid_field(champ)){
		OnChangeLogger.log("Algo change: cannot identify properly field " + champ.id);
		return;
	}

	//Don't process empty field
	if( is_empty(champ)){
		OnChangeLogger.log("Algo change: field is empty, no process.");
		return;
	}

	//Don't process paiement card
	if( check_card(valeur_utilisateur)){
		OnChangeLogger.log("Algo change: no process executed for card number " + valeur_utilisateur);
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

			console.log("Key object = " + JSON.stringify(key_object, null, 4));
			console.log("pivot referent = " + pivot_referent);

			//In all the three cases below, we update key pivot weight, using an objecf from user front db
			/* pivot_weight is like below, representing pivot weight, for corresponding user value 
				* {
				*      "nom": "2.3",
				*      "prenom": "4.5"
				* }
			*/
			var pivot_weight = user_front_db.get_pivot_weight_from_values(valeur_utilisateur);

			//Key exist and there is a referent pivot
			if(key_object && website_front_db.get_referent_pivot(domain, key_domain) != null){
				console.info("Key and pivot referent found: " + key_domain + ": " + pivot_referent);

				//For the sake of clarity, creating temp var
				var weight_pivot_max = website_front_db.get_max_weight(domain, key_domain);
				console.log("Maximum pivot: " + weight_pivot_max["pivot"]);
				console.log("Maximum weight: " + weight_pivot_max["weight"]);

				user_front_db.change_value_pivot_trouve_domaine(key_domain, pivot_referent, valeur_utilisateur, weight_pivot_max["weight"]);		
				website_front_db.apply_pivot_on_key(domain, key_domain, pivot_weight);
			}
			//Key exist but no pivot referent
			else if(key_object){
				console.log("No pivot referent for key domain " + key_domain);
				//get pivot and weight associated with user value
				website_front_db.apply_pivot_on_key(domain, key_domain, pivot_weight);
			}
			//Key does not exist at all, don't create user value
			else{
				console.log("No key at all for domain key: " + key_domain);
				//heuristic weight is undefined
				website_front_db.create_key(domain, key_domain);
				website_front_db.apply_pivot_on_key(domain, key_domain, pivot_weight);

				//Don't add user value for now
				//user_front_db.change_value_pivot_non_trouve_domaine(key_domain, new_pivot, valeur_utilisateur);
			}
		}else{
			OnChangeLogger.error("Algo change: Critical cannot find current user. Please log in.");
		}
	});
}
