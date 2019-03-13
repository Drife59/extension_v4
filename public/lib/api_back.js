/*
Projet Corail
Auteur: Benjamin GRASSART
Année: 2019

api_back.js

Retourne les objets xttp permettant de faire les requêtes souhaitées sur le back.
*/


//Config API Domaine
//------------------
//Le <domaine> sera à remplacer par le "vrai" domaine
var prefix_url_domaine = "website/domaine_a_remplacer"; 

var url_create_domaine = endpoint_back + prefix_url_domaine

var url_get_keys_v5 = endpoint_back + prefix_url_domaine + "/keys";

//Méthode POST = création, Méthode PUT = MAJ
var url_add_key_domaine = endpoint_back + prefix_url_domaine + "/key";
var url_put_key_domaine = url_add_key_domaine;


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

// #GET Retourne un objet http request pour récupérer les clés d'un domaine
function xhttp_get_keys_v5(domain){
    var xhttp_back_api = new XMLHttpRequest();
    var url_final = url_get_keys_v5.replace("domaine_a_remplacer", window.location.host, true);
    console.debug("Final url: " + url_final);
    xhttp_back_api.open("GET", url_final);
	xhttp_back_api.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp_back_api.send();
    return xhttp_back_api;
}

// #POST Retourne un objet xhttp pour ajouter une nouvelle clée sur le domaine
/*
Key obj is like:
{ 
    "cle": <name key website>,
    "pivot_reference": <pivot ref found>
    first_name: 
    family_name: 
    postal_code: 
    home_city:
    cellphone_number: 
    main_email: 
    main_full_address:
    day_of_birth:
    month_of_birth:
    year_of_birth:
    company:
    homephone:
    cvv:
    cardexpirymonth:
    cardexpiryyear:
    full_birthdate: 
}
*/
function xhttp_add_key_domain(key_obj){
    var xhttp_back_api = new XMLHttpRequest();
    var url_final = url_add_key_domaine.replace("domaine_a_remplacer", window.location.host, true);
    xhttp_back_api.open("POST", url_final);
    xhttp_back_api.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    
    //V5: send a complex key object request containing all data
    xhttp_back_api.send(JSON.stringify(key_obj));
    return xhttp_back_api;
}

function xhttp_put_key_domain(key_obj){
    var xhttp_back_api = new XMLHttpRequest();
    var url_final = url_put_key_domaine.replace("domaine_a_remplacer", window.location.host, true);
    xhttp_back_api.open("PUT", url_final);
    xhttp_back_api.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    
    //V5: send a complex key object request containing all data
    xhttp_back_api.send(JSON.stringify(key_obj));
    return xhttp_back_api;
}

/*
########################
Objet xhttp des user V5
########################
*/

//config API User
//---------------
var prefix_url_user  = "user/user_a_remplacer";
var prefix_url_value = "value/value_to_replace";

var url_create_value_v5     = endpoint_back + prefix_url_user + "/pivot/pivot_to_replace/value/value_text";
var url_get_object_front_db = endpoint_back + prefix_url_user + "/uservalue_profilless";
var url_update_weigth       = endpoint_back + prefix_url_value + "/weight/weight_to_replace";
var url_value               = endpoint_back + prefix_url_value;

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
    var url_final = url_create_value_v5.replace("user_a_remplacer", email)
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
####################
Objet xhttp user V6
####################
*/

var url_all_profil = endpoint_back + "user/{email}/profils";
var url_profil = endpoint_back + "user/{email}/profil/{profilId}";
var url_create_profil = endpoint_back + "user/{email}/profil/{profilName}";
var url_create_value_v6 = endpoint_back + "user/{email}/pivot/{pivot_name}/value/{value_text}?profil_id={profil_id_text}";
var url_all_values = endpoint_back + "user/{email}/values_with_profil";


//Profil API
//----------

function xhttp_get_profils(email){
    var xhttp_back_api = new XMLHttpRequest();
    var url_final = url_all_profil.replace("{email}", email);

    xhttp_back_api.open("GET", url_final, true);
    xhttp_back_api.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp_back_api.send();
    return xhttp_back_api;
}

function xhttp_create_profil(email, profil_name){
    var xhttp_back_api = new XMLHttpRequest();
    var url_final = url_create_profil.replace("{email}", email)
                                     .replace("{profilName}", profil_name);

    xhttp_back_api.open("POST", url_final, true);
    xhttp_back_api.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp_back_api.send();
    return xhttp_back_api;
}

function xhttp_delete_profil(email, profil_id){
    var xhttp_back_api = new XMLHttpRequest();
    var url_final = url_profil.replace("{email}", email)
                                  .replace("{profilId}", profil_id);

    xhttp_back_api.open("DELETE", url_final, true);
    xhttp_back_api.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp_back_api.send();
    return xhttp_back_api;
}



//User value API
//--------------

function xhttp_create_value_user_with_profil(email, pivot_name, value, profil_id){
    var xhttp_back_api = new XMLHttpRequest();
    var url_final = url_create_value_v6.replace("{email}", email)
                                 .replace("{pivot_name}", pivot_name)
                                 .replace("{value_text}", value)
                                 .replace("{profil_id_text}", profil_id);

    console.log("Final url: " + url_final);
    xhttp_back_api.open("POST", url_final, true);
    xhttp_back_api.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp_back_api.send();
    return xhttp_back_api;
}

//Return all values in a flat form
function xhttp_all_values_with_profil(email){
    var xhttp_back_api = new XMLHttpRequest();
    var url_final = url_all_values.replace("{email}", email);

    console.log("Final url: " + url_final);
    xhttp_back_api.open("GET", url_final, true);
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