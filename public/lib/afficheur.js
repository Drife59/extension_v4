/*
Projet Corail
Auteur: Benjamin GRASSART
Année: 2017

afficheur.js

Comporte la fonctionnalitée qui, suite au parsing de la page
affiche son contenu.
*/

//détermine si la variable extraite du html est anonyme (non requetable),
//et la logue en console le cas échéant
//Anonyme = pas d'id, pas de classe, pas de name
function est_anonyme(variable){
	if( (variable.id == undefined || variable.id == "") &&
		(variable.name == undefined || variable.name == "") &&
		(variable.className == undefined || variable.className == "") ){
			alert("La variable est anonyme, affichage dans les logs");
			console.log(variable);
			return true;
		}
	return false;
}

//Affiche les input passés en paramètres
//inputs: la liste des inputs en paramètres
//type_input: le type d'input à afficher
function alert_input(inputs, type_input){
	if(inputs.length == 0)
		return;
	var string_to_display = "";
	for(var i=0 ; i<inputs.length ; i++){
		//Dans le cas ou la variable n'est pas identifié, on affiche tout
		if( !est_anonyme(inputs[i]) ){
			string_to_display = string_to_display + "id: " + inputs[i].id + " class: " + inputs[i].className +
						" name: " + inputs[i].name + " type: " + inputs[i].type + "\n";
		}

	}
	alert("Voici les inputs de type "+ type_input +
        "\nIl y en a: " + inputs.length + "\n\n" + string_to_display);
}

//Affiche les champs inputs
function display_input() {
	for( var i=0 ; i<type_to_include.length ; i++){
		alert_input(inputs[type_to_include[i]], type_to_include[i]);
	}
	return "Done";
}

//Affiche les champs select
function display_select() {
	var string_to_display = "";
	for(var i=0 ; i<selects.length ; i++){
		string_to_display = string_to_display + "id: " + selects[i].id + " class: " + selects[i].className +
						" name: " + selects[i].name + " type: " + selects[i].type + "\n";
	}
	alert("Voici les selects: " +
		  "\nIl y en a: " + selects.length + "\n\n" + string_to_display);
	return "Done";
}