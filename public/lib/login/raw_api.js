/*
Projet Corail
Auteur: Benjamin GRASSART
Année: 2019

raw_api.js

Define Raw API call for login.
*/

//Endpoint config 
var url_login_domain = endpoint_back + "user/{email}/login/{domain}";
var url_login_update = endpoint_back + "user/{email}/login/{login_id}/password/{password}";
var url_login_delete = endpoint_back + "user/{email}/login/{login_id}";



// Pure login API
// ---------------

function xhttp_get_login_psd(email, domain){
    var xhttp_back_api = new XMLHttpRequest();
    var url_final = url_login_domain.replace("{email}", email)
                                  .replace("{domain}", domain);

    xhttp_back_api.open("GET", url_final, true);
    xhttp_back_api.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp_back_api.send();
    return xhttp_back_api;
}

function xhttp_add_login_psd(email, domain, login, password){
    var xhttp_back_api = new XMLHttpRequest();
    var url_final = url_login_domain.replace("{email}", email)
                                  .replace("{domain}", domain);

    var login_obj = {
        login: login,
        password: password
    }

    console.debug("Sending objet login to back: " + JSON.stringify(login_obj));
    xhttp_back_api.open("POST", url_final, true);
    xhttp_back_api.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp_back_api.send(JSON.stringify(login_obj));
    return xhttp_back_api;
}

function xhttp_update_login_psd(email, login_id, new_password){
    var xhttp_back_api = new XMLHttpRequest();
    var url_final = url_login_update.replace("{email}", email)
                                  .replace("{login_id}", login_id)
                                  .replace("{password}", new_password);

    xhttp_back_api.open("PUT", url_final, true);
    xhttp_back_api.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp_back_api.send();
    return xhttp_back_api;
}



function xhttp_delete_login_psd(email, login_id){
    var xhttp_back_api = new XMLHttpRequest();
    var url_final = url_login_domain.replace("{email}", email)
                                    .replace("{login_id}", login_id);

    xhttp_back_api.open("DELETE", url_final, true);
    xhttp_back_api.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp_back_api.send();
    return xhttp_back_api;
}
