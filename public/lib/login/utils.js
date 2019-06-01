/*
Projet Corail
Auteur: Benjamin GRASSART
Année: 2019

login.utils.js

Define transversal function for login.
*/

// Be careful, in order for this to work,
// the loggin detection and parsing must have been done
function is_login_field(field){
    console.warn("Field id: " + field.id);
    console.warn("Is a login field ? " + field.hasAttribute(CODE_LOGIN_FIELD));
    return field.hasAttribute(CODE_LOGIN_FIELD);
}

// Be careful, in order for this to work,
// the loggin detection and parsing must have been done
function is_password_field(field){
    return field.hasAttribute(CODE_PASSWORD_FIELD);
}