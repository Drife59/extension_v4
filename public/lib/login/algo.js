/*
Projet Corail
Auteur: Benjamin GRASSART
Année: 2019

login/algo.js

Define dedicated algo for login functionnality. 
*/


function blur_field_login(){
    //This should not happen, but you know :)
    if( current_login_field == null || current_password_field == null){
        console.warn("[blur_field_login] Abort blur event process, missing field or login");
        console.debug("[blur_field_login] current_login_form: " + current_login_form);
        console.debug("[blur_field_login] current_login_field: " + current_login_field);
        console.debug("[blur_field_login] current_password_field: " + current_password_field);

        return false;
    }

    if(pointer_on_login_list == true){
        console.debug("The profil list is currently fetched, abort blur algo");
        return false;
    }

    var current_login_value    = current_login_field.value;
    var current_password_value = current_password_field.value;

    if( current_login_value == "" || current_password_value == ""){
        console.info("[blur_field_login] Login or password empty, don't continue login blur algo.");
        return false;
    }

    if( current_login_value.length < minimum_login_length ){
        console.info("[blur_field_login] login length < " + minimum_login_length 
            + "\nAbort login / psd saving process");
        return false;
    }
    else if(current_password_value.length < minimum_password_length ){
        console.info("[blur_field_login] password length < " + minimum_password_length 
            + "\nAbort login / psd saving process");
        return false;
    }

    //Input OK, next does this exact couple already exist ?
    //If yes, we should not do anything
    if(login_front_db.check_login_psd_existence(current_login_value, current_password_value)){
        console.info("[blur_field_login] login " + current_login_value + " and psd : " + current_password_value + 
            " already exists. Don't do anything");
    }
    
    //If there is only one the login correspondance, just update password
    else if(login_front_db.check_login_existence(current_login_value)){
        var login_to_update = login_front_db.check_login_existence(current_login_value);
        console.info("[blur_field_login] login " + current_login_value + " exists but password does not correspond." + 
         "\Updating password.");
         login_front_db.update_login_psd(current_user, login_to_update.login_id, current_password_value);

        new Noty({
            type: 'info',
            layout: 'topRight',
            theme: 'mint',
            text: "Updated password for login " + current_login_value,
            timeout: dislay_time_notification,
            progressBar: true,
            closeWith: ['click', 'button'],
            killer: true,
            force: true,
        }).show();
    }

    // Ok, so login/psd is not known, not even login alone.
    // So need to create a new couple login/psd 
    else{
        console.info("[blur_field_login] Creating couple " + current_login_value + " / " + current_password_value);
        login_front_db.add_login_psd(current_login_value, current_password_value);

        new Noty({
            type: 'info',
            layout: 'topRight',
            theme: 'mint',
            text: "Added login " + current_login_value + " with its password.",
            timeout: dislay_time_notification,
            progressBar: true,
            closeWith: ['click', 'button'],
            killer: true,
            force: true,
        }).show();
    }
}