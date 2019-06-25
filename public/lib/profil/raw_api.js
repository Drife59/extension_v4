/*
Projet Corail
Auteur: Benjamin GRASSART
Année: 2019

raw_api.js

Define Raw API call for profil.
*/

//Endpoint config 
var url_all_profil = endpoint_back + "user/{email}/profils";
var url_profil = endpoint_back + "user/{email}/profil/{profilId}";
var url_create_profil = endpoint_back + "user/{email}/profil/{profilName}";
var url_update_weight = endpoint_back + "user/{email}/profil/{profilId}/weight/{weight}";
var url_create_value_v6 = endpoint_back + "user/{email}/pivot/{pivot_name}/value/{value_text}?profil_id={profil_id}";
var url_all_values = endpoint_back + "user/{email}/values_with_profil";



// Pure profil API
// ---------------

function xhttp_get_profils(email){
    var xhttp_back_api = new XMLHttpRequest();
    var url_final = url_all_profil.replace("{email}", email);

    xhttp_back_api.open("GET", url_final, true);
    xhttp_back_api.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp_back_api.setRequestHeader(CODE_HEADER_PASSWORD, current_psd);

    xhttp_back_api.send();
    return xhttp_back_api;
}

function xhttp_create_profil(email, profil_name){
    var xhttp_back_api = new XMLHttpRequest();
    var url_final = url_create_profil.replace("{email}", email)
                                        .replace("{profilName}", profil_name);

    xhttp_back_api.open("POST", url_final, true);
    xhttp_back_api.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp_back_api.setRequestHeader(CODE_HEADER_PASSWORD, current_psd);

    xhttp_back_api.send();
    return xhttp_back_api;
}

function xhttp_create_profil_value_user(email, pivot, value, profil_id){
    var xhttp_back_api = new XMLHttpRequest();
    //Don't forget to capitalize user value, and encode it
    var url_final = url_create_value_v6.replace("{email}", email)
                                    .replace("{pivot_name}", pivot)
                                    .replace("{value_text}", encodeURIComponent(value))
                                    .replace("{profil_id}", profil_id);
    xhttp_back_api.open("POST", url_final, true);
    xhttp_back_api.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp_back_api.setRequestHeader(CODE_HEADER_PASSWORD, current_psd);

    xhttp_back_api.send();
    return xhttp_back_api;
}
    

function xhttp_profil_update_weight(email, profil_id, new_weight){
    var xhttp_back_api = new XMLHttpRequest();
    var url_final = url_update_weight.replace("{email}", email)
                                        .replace("{profilId}", profil_id)
                                        .replace("{weight}", new_weight);

    xhttp_back_api.open("PUT", url_final, true);
    xhttp_back_api.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp_back_api.setRequestHeader(CODE_HEADER_PASSWORD, current_psd);

    xhttp_back_api.send();
    return xhttp_back_api;
}



function xhttp_delete_profil(email, profil_id){
    var xhttp_back_api = new XMLHttpRequest();
    var url_final = url_profil.replace("{email}", email)
                                    .replace("{profilId}", profil_id);

    xhttp_back_api.open("DELETE", url_final, true);
    xhttp_back_api.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp_back_api.setRequestHeader(CODE_HEADER_PASSWORD, current_psd);

    xhttp_back_api.send();
    return xhttp_back_api;
}

// User value API
// --------------


//Return all values in a flat form
function xhttp_all_values_with_profil(email){
    var xhttp_back_api = new XMLHttpRequest();
    var url_final = url_all_values.replace("{email}", email);

    console.debug("Final url: " + url_final);
    xhttp_back_api.open("GET", url_final, true);
    xhttp_back_api.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp_back_api.setRequestHeader(CODE_HEADER_PASSWORD, current_psd);

    xhttp_back_api.send();
    return xhttp_back_api;
}