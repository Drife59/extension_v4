/*
Projet Corail
Auteur: Benjamin GRASSART
Année: 2018

front.js

Défini le code qui s'exécute pour chaque ouverture de l'extension.
Dernier module à charger dans le manifest.json.
*/


/*
ATTENTION: LES 4 VARIABLES CI-DESSOUS DOIVENT ETRE DEFINIE
AVANT TOUTE EXECUTION DU LOGICIEL.
Elles ne peuvent donc pas être définie dans le fichier de config.
*/

//Permet de savoir si l'app est déjà lancée
//Evite le multiple lancement si plusieurs évènements sont déclenchés
//par la page fille
var app_launched = false;

//Temps d'attente en ms avant remplissage des champs lors du chargement de page
//Attention: un temps d'attente trop court risque de faire échouer le lancement
//de l'app, pour cause de variable globale non-connue
var timeout_parsing = 1000;

/*
Variables communes aux 2 fonctionnalitées
*/
//Comporte tous les champs inputs pertinents à traiter
//Objet avec pour chaque variable le type d'input dont la valeur est la
//liste des inputs détectés
var inputs = new Object();
var selects = [];
//On instancie une seule fois l'objet pour faire des appel API
var xhttp = new XMLHttpRequest();

//Add this variable in file directly.
//If not, bug when using it
var enable_front_log = false;

//Fonction nécessaire aux 2 fonctionnalitées
//Parse la page et récupère tous les champs pertinents (selon config)
function init_fields(){
	//Initialisation des champs input
	for( var i=0 ; i<type_to_include.length ; i++){
		inputs[type_to_include[i]] = document.body.querySelectorAll("input[type=" +
		                                                 type_to_include[i] + "]");
	}
	//Initialisation des champs selects
	selects = document.body.querySelectorAll("select");
}

//Bind tous les éléments inputs aux algos
function bind_inputs(){
	for( var i=0 ; i<type_to_include.length ; i++){
		var inputs_type = inputs[type_to_include[i]];

		for( j=0 ; j<inputs_type.length ; j++){
			inputs_type[j].addEventListener('change', changeAlgo, false);
		}
	}
}

//Bind tous les éléments selects aux algos
function bind_selects(){
	for(var i=0 ; i<selects.length ; i++){
		selects[i].addEventListener('change', changeAlgo, false);
		selects[i].onchange = function(evt){
			if(enable_front_log)
				console.info("Elément select modifié: " + HtmlEltToString(evt.target));
		};
	}
}

//Cré un domaine en base si il n'existe pas déjà
function init_domaine(){
	var xhttp_dom1 = xhttp_get_domaine(window.location.host);

	xhttp_dom1.onreadystatechange = function () {
		if (xhttp_dom1.readyState == 4 && xhttp_dom1.status == 200)
			console.info("Le domaine existe déjà !");
		else if(xhttp_dom1.readyState == 4 && xhttp_dom1.status == 404){
			if(enable_front_log)
				console.info("Le domaine n'existe pas, demande de création");
			var xhttp_dom2 = xhttp_create_domaine(window.location.host);
			xhttp_dom2.onreadystatechange = function () {
				if (xhttp_dom2.readyState == 4 ){
					if(enable_front_log)
						console.log(xhttp_dom2.responseText);
				}
			}
		}
	}
}


/*
################################
POINT D'ENTREE DE L'APPLICATION
################################
*/

//Bind l'évènement onBlur sur les champs détectés
function bind_user_action(){
	init_fields();
	bind_inputs();
	bind_selects();
	chrome.storage.sync.get("current_user", function(data) {
		if( Object.keys(data).length !== 0){
			fill_fields(data.current_user);
		}else{
			if(enable_front_log)
				console.error("current user introuvable pour le remplissage des champs.")
		}
	});
}

function load_db_from_back(){
	chrome.storage.sync.get("current_user", function(data) {
		if( Object.keys(data).length !== 0){
			//For the sake of clarity
			var current_user = data.current_user;
			if(enable_front_log)
				console.log("Found current user " + current_user + " for loading user values from back");
			
			var xhttp_front_db = xhttp_get_object_front_db(current_user);

			xhttp_front_db.onreadystatechange = function () {
				//Could find user values for this user
				if (xhttp_front_db.readyState == 4 && xhttp_front_db.status == 200) {
					user_front_db = new UserPivotValues(xhttp_front_db.responseText);
					user_front_db.set_current_user(current_user);
				}
				else if( xhttp_front_db.readyState == 4 && xhttp_front_db.status != 200){
					if(enable_front_log)
						console.error("Could not find user values for: " + current_user);
				}
			}
		}else{
			if(enable_front_log)
				console.error("Cannot find current user for user value db loading.");
		}
	});
}

//Lance l'app, cad le parsing et binding des champs
function lancement_app(type_evt){
	if(enable_front_log)
		console.log("Loading values from back...");
	//TODO: make this more rare
	load_db_from_back();
	
	if(enable_front_log)
		console.info("Lancement de l'App...");
	app_launched = true;
	setTimeout(function() {
		bind_user_action();		
		init_domaine();
	}, timeout_parsing);
}


window.addEventListener('pageshow', function () {
	if(enable_front_log)
		console.info("window.pageshow event");
	if( !app_launched )
		lancement_app("Pageshow");
});

window.addEventListener('hashchange', function () {
	if(enable_front_log)
		console.info("window.hashchange event");
	if( !app_launched )
		lancement_app("Hashchange");
});

window.addEventListener('unload', function () {
	if(enable_front_log)
		console.info("window.unload event");
	if( !app_launched )
		lancement_app("UnLoad");
});

window.addEventListener('load', function () {
	if(enable_front_log)
		console.info("window.load event");
	if( !app_launched )
		lancement_app("Load");
});