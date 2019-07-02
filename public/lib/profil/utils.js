/*
Projet Corail
Auteur: Benjamin GRASSART
Année: 2019

profil.utils.js

Define transversal function for profils.
*/

/*Create a fake profil from page.
input object: 
{
    pivot1: value,
    pivot2: value,
    ...
    pivotn: value
}

return a unique profil, like the following:
{
    "profilName": "profil from page",
    "weight": 1,
    "first_name": {
        "userValueId": 0,
        "valueText": "Julien"
    },
    "family_name": {
        "userValueId": 0,
        "valueText": "Derville"
    },
    "postal_code": {
        "userValueId": 0,
        "valueText": "59000"
    }
}

This profil is special, as it does not exist in back.
We "mark" it so it can later on be created in back, with proper id.
For now, all ids are faked.
*/
function create_profil_from_page(pivot_value_page){
    var fake_profil = {}
    fake_profil["profilName"] = "profil from page";
    fake_profil["weight"] = 1;

    for(var pivot in pivot_value_page){
        //if the value is null, you should not collect it to create the profil...
        if(pivot_value_page[pivot] == "" || pivot_value_page[pivot] == " " || pivot_value_page[pivot] == null){
            continue;
        }
        var obj_user_value = {};
        obj_user_value["userValueId"] = 0;
        obj_user_value["valueText"] = pivot_value_page[pivot];
        fake_profil[pivot] = obj_user_value;
    }

    console.info("Fake profil from page: " + JSON.stringify(fake_profil, null, 4));
    return fake_profil;
}

function init_new_profil(user){
    console.info("[init_new_profil] Creating a new empty user profil DB for: " + user);

    profil_db = new UserProfil(user);

    var xhttp_profil = xhttp_create_profil(user, "defaut_profil");

    //Profil has been created in back
    xhttp_profil.onreadystatechange = function () {
        if (xhttp_profil.readyState == 4 && xhttp_profil.status == 200) {
            var data = JSON.parse(xhttp_profil.responseText);

            //We can load it in front 
            load_profils_from_back(user, true);

            //We need to wait for the back result
            setTimeout(function () {
                //By default, create the main email pivot / user value
                //We need the send the ref of profil_db obj because it will be lose due to "setTimeout"
                profil_db.add_value_to_profil(user, CODE_MAIN_EMAIL, user, data["profilId"], false, init_event_list_profil);
                console.info("[init_new_profil] Adding " + CODE_MAIN_EMAIL + " to default profil");
            }, timeout_profil_creation);
            
        }
    }
}

//Check that the cellphone number is properly formatted 
function sanitize_new_user_value(pivot_code, new_value){

    if(liste_pivots_to_capitalize.includes(pivot_code)){
        new_value = new_value.capitalize();
    }

    if(pivot_code == CODE_CELLPHONE){
        ///If we made a mistake by putting a short cellphone number 
        //in classical cellphone field, correct it.
        if(new_value.length == 9){
            new_value = "0" + new_value;
            console.info("new_value was corrected, detected a short cellphone number in classical cellphone field.");
            console.info("Adding a 0 to create \"classical\" cellphone number, final new value: " + new_value);
        }
    }

    if(pivot_code == CODE_SHORT_CELLPHONE){
        ///If we made a mistake by putting a short cellphone number 
        //in classical cellphone field, correct it.
        if(new_value.length == 10){
            new_value = new_value.slice(1);
            console.info("new_value was corrected, detected a classical cellphone number in short cellphone field.");
            console.info("Removing 0 to create \"short\" number, final new value: " + new_value);
        }
    }

    //Add a zero if day or month has been entered without this zero
    if(pivot_code == CODE_DAY_BIRTH || pivot_code == CODE_MONTH_BIRTH){
        if( new_value.length == 1){
            console.info("Adding '0' beside new value: " + new_value + " for pivot " + pivot_code);
            new_value = "0" + new_value;
        }
    }

    if(pivot_code == CODE_YEAR_BIRTH){
        if( new_value.length == 2){
            console.info("Adding '19' beside new value: " + new_value + " for pivot " + pivot_code);
            new_value = "19" + new_value;
        }
    }

    //For the civility, we need to do the mapping to the base value
    if(pivot_code == CODE_CIVILITY){
        if(mister_mapping.includes(new_value)){
            console.info("Translate value " + new_value + " into " + base_value_mister);
            new_value = base_value_mister;
        }else if(madam_mapping.includes(new_value)){
            console.info("Translate value " + new_value + " into " + base_value_madam);
            new_value = base_value_madam;
        }

    }

    return new_value;
}

//Check if the profil sent as parameter is eligible to creation 
function has_minimum_attribute(profil_test){
    if(Object.keys(profil_test).length < 3){
        return false;
    }

    //Check each required key is present in pivot
    for(var i in liste_pivot_minimum_profil){
        var pivot = liste_pivot_minimum_profil[i];
        if( !(pivot in profil_test) ){
            console.info("[has_minimum_attribute] Missing pivot " + pivot + " cannot create profil");
            return false;
        }
    }
    return true;
}

