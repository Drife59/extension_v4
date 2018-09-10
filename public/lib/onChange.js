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

//Algo if key is found in domain
function pivotTrouveDomaine(current_user, pivot_domaine, valeur_utilisateur, cle_domaine){
	user_front_db.change_value_pivot_trouve_domaine(cle_domaine, pivot_domaine, valeur_utilisateur);
}

//Cannot find key for domain
function pivotNonTrouveDomaine(current_user, cle_domaine, valeur_utilisateur){
	OnChangeLogger.log("Algo change / unknown pivot domain: cannot find pivot for key " + cle_domaine);

	//Create new dummy pivot
	var new_pivot = "pivot_" + guid();
	var xhttp_dom = xhttp_add_pivot_domaine(cle_domaine, new_pivot);
	
	xhttp_dom.onreadystatechange = function () {
		if (xhttp_dom.readyState == 4 && (xhttp_dom.status == 200 || xhttp_dom.status == 204)) {
			OnChangeLogger.info("Algo change / unknown pivot domain: created pivot domain: " + cle_domaine + " -> " + new_pivot);
			user_front_db.change_value_pivot_non_trouve_domaine(cle_domaine, new_pivot, valeur_utilisateur);
		}
	}
}

//Main algo for event change detected on input field
function changeAlgo(evt){
	var champ = evt.target
	OnChangeLogger.log("Algo change: field " + champ.tagName + " modified: " + HtmlEltToString(champ));
	var cle_domaine = construit_domaine_cle(champ);
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
			var xhttp_dom = xhttp_get_cle_domaine_v2(cle_domaine);
			xhttp_dom.onreadystatechange = function () {
				//Key exist for domain
				if (xhttp_dom.readyState == 4 && xhttp_dom.status == 200) {
					var pivot_domaine = JSON.parse(xhttp_dom.responseText)["pivot"]["name"];
					OnChangeLogger.log("Algo Change: Key " + cle_domaine + " known, corresponding to " + pivot_domaine);
					pivotTrouveDomaine(data.current_user, pivot_domaine, valeur_utilisateur, cle_domaine);
				}
				//Cannot find key in domain
				else if(xhttp_dom.readyState == 4 && xhttp_dom.status == 404) {
					OnChangeLogger.log("Algo change: Cannot find pivot in domain");
					pivotNonTrouveDomaine(data.current_user, cle_domaine, valeur_utilisateur);
				}
			}
		}else{
			OnChangeLogger.error("Algo change: Critical cannot find current user. Please log in.");
		}
	});
}
