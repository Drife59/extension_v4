/*
Projet Corail
Auteur: Benjamin GRASSART
Année: 2017

api_back.js

Retourne les objets xttp permettant de faire les requêtes souhaitées sur le back.
*/


//Config API Domaine
//------------------
//Le <domaine> sera à remplacer par le "vrai" domaine
var prefix_url_domaine = "website/domaine_a_remplacer"; 

var url_create_domaine = endpoint_back_up + prefix_url_domaine

//Récupération des clés du domaine, la valeur associée étant les pivots
var url_get_cles_domaine_v1 = endpoint_back_up + prefix_url_domaine + "/pivots_v1";

//Récupération d'une cle domaine en V2
var url_get_cle_domaine_v2 = endpoint_back_up + prefix_url_domaine + "/key/key_to_replace" ;

//Méthode POST = création, Méthode PUT = MAJ
var url_set_pivot_domaine = endpoint_back_up + prefix_url_domaine + "/pivot";


/*
########################
Objet xhttp des domaines
########################
*/

//Attention: A cause de l'asynchrone, il faut créer un nouvel objet xhttp à chaque fois,
//sinon on risque d'affecter le même plusieurs fois et de faire la mauvaise requête

// #GET Vérifie qu'un domaine existe
function xhttp_get_domaine(domaine){
    var xhttp_back_api = new XMLHttpRequest();
    xhttp_back_api.open("GET", url_create_domaine.replace("domaine_a_remplacer", domaine), true);
	xhttp_back_api.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp_back_api.send();
    return xhttp_back_api;
}

// #POST Cré un nouveau domaine vide
function xhttp_create_domaine(domaine){
    var xhttp_back_api = new XMLHttpRequest();
    xhttp_back_api.open("POST", url_create_domaine.replace("domaine_a_remplacer", domaine), true);
	xhttp_back_api.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp_back_api.send();
    return xhttp_back_api;
}

// #GET Retourne un objet http request pour récupérer les clés / pivot du domaine actuel
//Mode compatibilité back-end v1
function xhttp_get_cles_domaine_v1(){
    var xhttp_back_api = new XMLHttpRequest();
    url_get_cles_domaine_v1 = url_get_cles_domaine_v1.replace("domaine_a_remplacer", window.location.host, true);
    xhttp_back_api.open("GET", url_get_cles_domaine_v1);
	xhttp_back_api.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp_back_api.send();
    return xhttp_back_api;
}

// #GET Retourne un objet http request pour récupérer un objet comportant clé et pivot en v2
function xhttp_get_cle_domaine_v2(key){
    var xhttp_back_api = new XMLHttpRequest();
    var url_final = url_get_cle_domaine_v2.replace("domaine_a_remplacer", window.location.host, true);
    url_final = url_final.replace("key_to_replace", key, true);
    console.debug("Final url: " + url_final);
    xhttp_back_api.open("GET", url_final);
	xhttp_back_api.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp_back_api.send();
    return xhttp_back_api;
}

// #POST Retourne un objet xhttp pour ajouter un nouveau pivot sur le domaine
function xhttp_add_pivot_domaine(cle, pivot){
    var xhttp_back_api = new XMLHttpRequest();
    var url_final = url_set_pivot_domaine.replace("domaine_a_remplacer", window.location.host, true);
    xhttp_back_api.open("POST", url_final);
    xhttp_back_api.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    
    if( pivot == "undefined"){
        //Création d'un pivot aléatoire
        xhttp_back_api.send(JSON.stringify({"Cle": cle}));
    }else{
        xhttp_back_api.send(JSON.stringify({"Cle": cle, "Pivot": pivot}));
    }
    return xhttp_back_api;
}

/*
############################
Objet xhttp des utilisateurs
############################
*/

//config API User
//---------------
var prefix_url_user  = "user/user_a_remplacer";
var prefix_url_value = "value/value_to_replace";

var url_create_value_v3     = endpoint_back_up + prefix_url_user + "/pivot/pivot_to_replace/value/value_text";
var url_get_object_front_db = endpoint_back_up + prefix_url_user + "/pivots_v3";
var url_update_weigth       = endpoint_back_up + prefix_url_value + "/weight/weight_to_replace";
var url_value               = endpoint_back_up + prefix_url_value;

/*
Sample to create an async function
(async () => {
    const rawResponse = await fetch('https://httpbin.org/post', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({a: 1, b: 'Textual content'})
    });
    const content = await rawResponse.json();
  
    console.log(content);
  })();
*/

// #POST Synchronously create a user value and associate it with pivot
async function fetch_create_value_user(email, pivot, value){
    var url_final = url_create_value_v3.replace("user_a_remplacer", email)
                                       .replace("pivot_to_replace", pivot)
                                       .replace("value_text", value);
    const rawResponse = await fetch(url_final, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    });
    const content = await rawResponse.json();  
    return content;
}

// #POST Asynchronously create a user value and associate it with pivot
function xhttp_create_value_user(email, pivot, value){
    var xhttp_back_api = new XMLHttpRequest();
    var url_final = url_create_value_v3.replace("user_a_remplacer", email)
                                 .replace("pivot_to_replace", pivot)
                                 .replace("value_text", value);

    console.log("Final url: " + url_final);
    xhttp_back_api.open("POST", url_final, true);
    xhttp_back_api.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp_back_api.send();
    return xhttp_back_api;
}

// #GET Get json to initialize front db
function xhttp_get_object_front_db(email){
    var xhttp_back_api = new XMLHttpRequest();
    var url_final = url_get_object_front_db.replace("user_a_remplacer", email);

    xhttp_back_api.open("GET", url_final, true);
    xhttp_back_api.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp_back_api.send();
    return xhttp_back_api;
}


// #PUT Update weight for value
function xhttp_update_weight(value_id, new_weight){
    var xhttp_back_api = new XMLHttpRequest();
    var url_final = url_update_weigth.replace("value_to_replace", value_id)
                                     .replace("weight_to_replace", new_weight);

    xhttp_back_api.open("PUT", url_final, true);
    xhttp_back_api.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp_back_api.send();
    return xhttp_back_api;
}

// #DELETE Delete user value id
function xhttp_delete_value(value_id){
    var xhttp_back_api = new XMLHttpRequest();
    var url_final = url_value.replace("value_to_replace", value_id);

    xhttp_back_api.open("DELETE", url_final, true);
    xhttp_back_api.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp_back_api.send();
    return xhttp_back_api;
}


/*
######################
Objet xhttp des admins
######################
*/

//API Admin
//---------

var prefix_url_admin = "admin"
//Méthode de demande de remplacement pivot
var url_create_merge = endpoint_back_up + prefix_url_admin + 
                        "/merge/pivot_origine/pivot_remplacement";

// #POST Envoie une demande de merge
function xhttp_create_merge(pivot_origine, pivot_remplacement,
                                        email, valeur, domaine, cle_req){
    var xhttp_back_api = new XMLHttpRequest();
    var url_final = url_create_merge.replace("pivot_origine", pivot_origine)
                               .replace("pivot_remplacement", pivot_remplacement);
    xhttp_back_api.open("POST", url_final, true);
    xhttp_back_api.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhttp_back_api.send(JSON.stringify({
        email: email,
        domaine: domaine,
        cle_req: cle_req,
        valeur: valeur
    }));
    return xhttp_back_api;
}