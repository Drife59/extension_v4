/*
Projet Corail
Auteur: Benjamin GRASSART
Année: 2019

pivot_translation.js

Define dedicated function to translate value from a pivot to another.
*/

//Just for tests
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}

 
//    Fullname translation 
//    --------------------

function build_fullname(firstname, familyname){
    return firstname.capitalize() + " " + familyname.capitalize();
}

function get_firstname_from_fullname(fullname){
    return fullname.split(' ')[0].capitalize();
}

function get_familyname_from_fullname(fullname){
    return fullname.split(' ')[1].capitalize();
}


//    birthdate translation 
//    ---------------------

function build_fullbirthdate(day_of_birth, month_of_birth, year_of_birth){
    return day_of_birth + "/" + month_of_birth + "/" + year_of_birth;
}

function get_day_of_birth_from_fullbirthdate(fullbirthdate){
    return fullbirthdate.split('/')[0];
}

function get_month_of_birth_from_fullbirthdate(fullbirthdate){
    return fullbirthdate.split('/')[1];
}

function get_year_of_birth_from_fullbirthdate(fullbirthdate){
    return fullbirthdate.split('/')[2];
}

//    cellphone number translation 
//    ----------------------------

// indicative must be complete (+33)
function build_fullnumber_with_indicative(indicative, phone_number){
    if(indicative.length != 3){
        console.warn("Cannot build fullphone number, indicative is wrong");
        return false;
    }

    //If there is the zero before number, delete it
    if(phone_number.length == 10){
        phone_number = phone_number.slice(1);
    }

    return indicative+phone_number;
}

function get_short_number_from_fullnumber(full_phone_number){
    if(full_phone_number.length != 12){
        console.warn("cannot return short number, wrong full_phone_number value provided");
        return false;
    }
    return full_phone_number.slice(3);
}

//From a classical number, get short number
function get_short_number_from_classical_number(phone_number){
    if(phone_number.length < 10){
        console.warn("Cannot build short number, size is too small");
        return false;
    }
    return phone_number.slice(1);
}

function get_classical_number_from_short(short_phone_number){
    if(short_phone_number.length != 9){
        console.warn("Cannot build classical number, size is not 9");
        return false;
    }
    return "0" + short_phone_number;
}


