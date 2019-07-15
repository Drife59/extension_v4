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

function get_day_of_birth_without_zero_from_fullbirthdate(fullbirthdate){
    var current_day = fullbirthdate.split('/')[0];

    var current_day_int = parseInt(current_day);

    if(current_day_int < 0 || current_day > 31){
        console.warn("[get_day_of_birth_withtout_zero_from_fullbirthdate] Cannot create a current_day from " + current_day);
    }

    //Alway 2 number from 10 on :)
    if(current_day_int > 9 )
        return current_day;
    
    //Ok, so this is between 0 and 9

    //There is no zero before the actual number (5) not (05)
    if(current_day.length == 1)
        return current_day;

    //There is a zero before the actual number, we will need to delete it
    else if(current_day.length == 2){
        return current_day.substr(1,1);
    }
    //This should never happen
    else{
        console.warn("[get_day_of_birth_withtout_zero_from_fullbirthdate] Cannot create a current_day from " + current_day);
    }
}

function get_month_of_birth_without_zero_from_fullbirthdate(fullbirthdate){
    var current_month = fullbirthdate.split('/')[1];

    var current_month_int = parseInt(current_month);

    if(current_month_int < 0 || current_month > 12){
        console.warn("[get_month_of_birth_withtout_zero_from_fullbirthdate] Cannot create a current_month from " + current_month);
    }

    //Alway 2 number from 10 on :)
    if(current_month_int > 9 )
        return current_month;
    
    //Ok, so this is between 0 and 9

    //There is no zero before the actual number (5) not (05)
    if(current_month.length == 1)
        return current_month;

    //There is a zero before the actual number, we will need to delete it
    else if(current_month.length == 2){
        return current_month.substr(1,1);
    }
    //This should never happen
    else{
        console.warn("[get_month_of_birth_withtout_zero_from_fullbirthdate] Cannot create a current_month from " + current_month);
    }
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


