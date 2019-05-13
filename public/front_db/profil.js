/*
Projet Corail
Auteur: Benjamin GRASSART
Année: 2019

user_db.js

V6 functionnality.
Define object to manage user profil
*/


//Endpoint config 
var url_all_profil = endpoint_back + "user/{email}/profils";
var url_profil = endpoint_back + "user/{email}/profil/{profilId}";
var url_create_profil = endpoint_back + "user/{email}/profil/{profilName}";
var url_update_weight = endpoint_back + "user/{email}/profil/{profilId}/weight/{weight}";
var url_create_value_v6 = endpoint_back + "user/{email}/pivot/{pivot_name}/value/{value_text}?profil_id={profil_id}";
var url_all_values = endpoint_back + "user/{email}/values_with_profil";



/*
The content of an object Profil would be as the following:
{
    "3": {
        "profilName": "default",
        "weight": 1
    },
    "4": {
        "profilName": "default2",
        "weight": 669.987,
        "first_name": {
            "userValueId": 20,
            "valueText": "tsointsoin"
        },
        "family_name": {
            "userValueId": 16,
            "valueText": "grassart"
        },
        "homephone": {
            "userValueId": 26,
            "valueText": "0320921500"
        }
    },
    "6": {
        "profilName": "toto",
        "weight": 1,
        "family_name": {
            "userValueId": 17,
            "valueText": "nom_toto"
        },
        "first_name": {
            "userValueId": 18,
            "valueText": "prenom_toto"
        }
    }
}
*/ 
class UserProfil {
    constructor(email, profil_values) {
        this.current_user = email;
        this.profil_values = {};

        if(profil_values !== undefined && profil_values !== "undefined"){
            this.profil_values = profil_values;
        }
        console.debug("Created UserProfil DB with values " + JSON.stringify(this.profil_values, null, 4));
    }

    // ############################
    // TECHNICAL LOW-LEVEL FUNCTION
    // ############################

    get_number_of_profil(){
        return Object.keys(this.profil_values).length;
    }

    get_id_all_profil(){
        return Object.keys(this.profil_values);
    }

    get_default_profil_id(){
        var ids_profil = this.get_id_all_profil();

        for(var i=0 ; i<ids_profil.length ; i++){
            var id_profil = ids_profil[i];
            var current_profil = this.profil_values[id_profil];

            if(current_profil["profilName"] == "defaut_profil"){
                return id_profil;
            }
        }
        console.warn("Could not find defaut profil");
    }

    //Save in storage current UserProfil
    set_profil_storage(){
        //chrome.storage.sync.set({"current_user": this.current_user});
        chrome.storage.sync.set({"profil_user_values": JSON.stringify(this.profil_values)}), function(){
            console.info("Set profil user db in google storage");
        };
        console.info("Set profil user db in google storage.");
    }

    //Load UserProfil object from local storage
    get_profil_storage(load_back_if_empty){
        //To handle the change of context
        var current_obj = this;
        chrome.storage.sync.get("profil_user_values", function (data) {
            if (typeof data.profil_user_values !== 'undefined') {
                current_obj.profil_values = JSON.parse(data.profil_user_values);
                console.info("[get_profil_storage]Loaded profil user value from cache: " + 
                    JSON.stringify(current_obj.profil_values, null, 4))
            } else {
                console.warn("[get_profil_storage] Could not load profil user value from cache");
                if(load_back_if_empty == true){
                    console.info("[load_profils_from_cache] Cannot find any profil in cache, try loading it from back");
                    load_profils_from_back(this.current_user, true);
                }
            }
        });

        chrome.storage.sync.get("current_user", function (data) {
            if (typeof data.current_user !== 'undefined') {
                current_obj.current_user = data.current_user;
                console.info("[get_profil_storage]Loaded current user from cache: " + data.current_user);
            } else {
                console.warn("[get_profil_storage] Could not load current user  from cache");
            }
        });
    }

    //Return a deep copy of db content
    get_clone_profil_values(){
        return JSON.parse(JSON.stringify(this.profil_values));
    }

    //Check if there is too many profil in base (number define in conf).
    //If this is the case, delete as many as needed.
    //Having too many profil can lead to issues, as failing to save in cache
    delete_too_many_profil(){

        var list_id_delete = [];

        var profil_clone = this.get_clone_profil_values();

        var min_weight = 100;
        var min_id_profil = null;

        while(Object.keys(profil_clone).length > nb_maximum_profil_in_base){
                
            //Find min weight profil in all list
            for (var id_profil in profil_clone) {
                var current_profil = this.profil_values[id_profil];
                
                if( current_profil["weight"] <= min_weight){
                    min_weight = current_profil["weight"];
                    min_id_profil = id_profil
                }
            }

            //Delete weakest profil
            delete profil_clone[min_id_profil];
            list_id_delete.push(min_id_profil);
            min_weight = 100;
        }

        for(var i = 0 ; i < list_id_delete.length ; i++ ){
            delete this.profil_values[list_id_delete[i]];
            this.xhttp_delete_profil(this.current_user, list_id_delete[i]);
            console.info("[delete_too_many_profil]: Deleted profil " + list_id_delete[i]);
            this.set_profil_storage();
        }
    }

    //decrease all profil weight by the coefficient in conf
    //Don't update back here, will update it once for all when quitting navigator
    decrease_delete_profil(){
        for(var profil_key in this.profil_values){
            var new_weight = profil_coeff_decrease * this.profil_values[profil_key]["weight"];

            //If profil is too weak, delete it
            if(new_weight < minimum_weight_profil){
                delete this.profil_values[profil_key];
                this.xhttp_delete_profil(this.current_user, profil_key);
                console.debug("[decrease_delete_profil]: Deleted profil " + profil_key + " which has weight too low: " + new_weight);
                this.set_profil_storage();
                continue;
            }
            this.profil_values[profil_key]["weight"] = new_weight;
            this.set_profil_storage();
        }

        //If after "classical" delete on weight, there are still too many profil,
        // delete the weakest until we have the wished nomber of profil (in config)
        this.delete_too_many_profil();
    }

    //Profil has been chosen, increase his 
    increase_profil_weight(profil_id){
        this.profil_values[profil_id]["weight"] = this.profil_values[profil_id]["weight"] + profil_chosen_add_weight;
    }

    //Update all weight in back
    update_all_weight_in_back(){
        for(var profil_id in this.profil_values){
            this.xhttp_update_weight(this.current_user, profil_id, this.profil_values[profil_id]["weight"]);
        }
    }

    //Check that the cellphone number is properly formatted 
    sanitize_new_user_value(pivot_code, new_value){
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

        return new_value;
    }

    //Create a value on a profil, async
    create_value_async(user, pivot_code, new_value, id_profil, profil){

        new_value = this.sanitize_new_user_value(pivot_code, new_value);

        var xhttp_create_value = this.xhttp_create_profil_value_user(user, pivot_code, new_value, id_profil);
        xhttp_create_value.onreadystatechange = function () {
            if (xhttp_create_value.readyState == 4 && xhttp_create_value.status == 200) {
                var data = JSON.parse(xhttp_create_value.responseText);
                profil[pivot_code] = {"userValueId": data["userValueId"], "valueText": new_value};
                console.info("Following value added for profil: " + id_profil + " on pivot: " + pivot_code);
                console.info(JSON.stringify(profil[pivot_code], null, 4));
            }
        }
    }

    /*Create the pivot translated from other pivot.*/
    create_pivot_translated(id_profil){
        if(! (this.profil_values.hasOwnProperty(id_profil))){
            console.warn("[create_pivot_translated]Cannot create translated pivot, id_profil " + id_profil + " does not exist");
            return;
        }

        var profil = this.profil_values[id_profil];

        console.info("Starting translation process for profil: " + id_profil);

        // fullname check
        //---------------

        if( !(profil.hasOwnProperty(CODE_FULL_NAME))){
            if( profil.hasOwnProperty(CODE_FIRSTNAME) && profil.hasOwnProperty(CODE_LASTNAME)){
                var new_value = build_fullname(profil[CODE_FIRSTNAME]["valueText"], profil[CODE_LASTNAME]["valueText"]);
                console.info("[create_pivot_translated] Creating fullname from others pivots");
                this.create_value_async(current_user, CODE_FULL_NAME, new_value, id_profil, profil);
            }
        }

        if( !(profil.hasOwnProperty(CODE_FIRSTNAME)) && profil.hasOwnProperty(CODE_FULL_NAME)){
            var new_value = get_firstname_from_fullname(profil[CODE_FULL_NAME]["valueText"]);
            console.info("[create_pivot_translated] Creating " + CODE_FIRSTNAME + " from " + CODE_FULL_NAME);
            this.create_value_async(current_user, CODE_FIRSTNAME, new_value, id_profil, profil);
        }

        if( !(profil.hasOwnProperty(CODE_LASTNAME)) && profil.hasOwnProperty(CODE_FULL_NAME)){
            var new_value = get_familyname_from_fullname(profil[CODE_FULL_NAME]["valueText"]);
            console.info("[create_pivot_translated] Creating " + CODE_LASTNAME + " from " + CODE_FULL_NAME);
            this.create_value_async(current_user, CODE_LASTNAME, new_value, id_profil, profil);
        }


        //birthdate check
        //---------------

        //full birthdate check
        if( !(profil.hasOwnProperty(CODE_FULL_BIRTHDATE))){
            if( profil.hasOwnProperty(CODE_DAY_BIRTH) && 
                profil.hasOwnProperty(CODE_MONTH_BIRTH) && 
                profil.hasOwnProperty(CODE_YEAR_BIRTH)){
                
                    var new_value = build_fullbirthdate(profil[CODE_DAY_BIRTH]["valueText"], 
                        profil[CODE_MONTH_BIRTH]["valueText"], 
                        profil[CODE_YEAR_BIRTH]["valueText"]);
                    console.info("[create_pivot_translated] Creating full birthdate from others pivots");
                    this.create_value_async(current_user, CODE_FULL_BIRTHDATE, new_value, id_profil, profil)
            }
        }

        // Solo (day, month, year) birth check
        // -----------------------------------

        if( !(profil.hasOwnProperty(CODE_DAY_BIRTH)) && profil.hasOwnProperty(CODE_FULL_BIRTHDATE)){
            var new_value = get_day_of_birth_from_fullbirthdate(profil[CODE_FULL_BIRTHDATE]["valueText"]);
            console.info("[create_pivot_translated] Creating " + CODE_DAY_BIRTH + " from " + CODE_FULL_BIRTHDATE);
            this.create_value_async(current_user, CODE_DAY_BIRTH, new_value, id_profil, profil)

        }

        if( !(profil.hasOwnProperty(CODE_MONTH_BIRTH)) && profil.hasOwnProperty(CODE_FULL_BIRTHDATE)){
            var new_value = get_month_of_birth_from_fullbirthdate(profil[CODE_FULL_BIRTHDATE]["valueText"]);
            console.info("[create_pivot_translated] Creating " + CODE_MONTH_BIRTH + " from " + CODE_FULL_BIRTHDATE);
            this.create_value_async(current_user, CODE_MONTH_BIRTH, new_value, id_profil, profil)
        }

        if( !(profil.hasOwnProperty(CODE_YEAR_BIRTH)) && profil.hasOwnProperty(CODE_FULL_BIRTHDATE)){
            var new_value = get_year_of_birth_from_fullbirthdate(profil[CODE_FULL_BIRTHDATE]["valueText"]);
            console.info("[create_pivot_translated] Creating " + CODE_YEAR_BIRTH + " from " + CODE_FULL_BIRTHDATE);
            this.create_value_async(current_user, CODE_YEAR_BIRTH, new_value, id_profil, profil)
        }

        // cellphone number check
        // ----------------------
        
        // Creation short number ?
        if(profil.hasOwnProperty(CODE_CELLPHONE) && (!profil.hasOwnProperty(CODE_SHORT_CELLPHONE))){
            var new_value = get_short_number_from_classical_number(profil[CODE_CELLPHONE]["valueText"]);
            if(new_value != false){
                console.info("[create_pivot_translated] Creating " + CODE_SHORT_CELLPHONE + " from " + CODE_CELLPHONE);
                this.create_value_async(current_user, CODE_SHORT_CELLPHONE, new_value, id_profil, profil);
            }else{
                console.warn("[create_pivot_translated] Cannot create short cellphone number.")
            }
        }

        // Creation classical number ?
        if(profil.hasOwnProperty(CODE_SHORT_CELLPHONE) && (!profil.hasOwnProperty(CODE_CELLPHONE))){
            var new_value = get_classical_number_from_short(profil[CODE_SHORT_CELLPHONE]["valueText"]);
            if(new_value != false){
                console.info("[create_pivot_translated] Creating " + CODE_CELLPHONE + " from " + CODE_SHORT_CELLPHONE);
                this.create_value_async(current_user, CODE_CELLPHONE, new_value, id_profil, profil)
            }else{
                console.warn("[create_pivot_translated] Cannot create classical cellphone number.")
            }
            
        }

        // Creation full number ?
        if(!(profil.hasOwnProperty(CODE_FULL_CELLPHONE)) && 
             profil.hasOwnProperty(CODE_CELLPHONE) && 
             profil.hasOwnProperty(CODE_INDICATIVE)){
                var new_value = build_fullnumber_with_indicative(profil[CODE_INDICATIVE]["valueText"], profil[CODE_CELLPHONE]["valueText"]);
                console.info("[create_pivot_translated] Creating " + CODE_FULL_CELLPHONE + " from " + CODE_INDICATIVE + " and " + CODE_CELLPHONE);
                this.create_value_async(current_user, CODE_FULL_CELLPHONE, new_value, id_profil, profil);
        }
        else if(!(profil.hasOwnProperty(CODE_FULL_CELLPHONE)) && 
             profil.hasOwnProperty(CODE_SHORT_CELLPHONE) && 
             profil.hasOwnProperty(CODE_INDICATIVE)){
                var new_value = build_fullnumber_with_indicative(profil[CODE_INDICATIVE]["valueText"], profil[CODE_SHORT_CELLPHONE]["valueText"]);
                console.info("[create_pivot_translated] Creating " + CODE_FULL_CELLPHONE + " from " + CODE_INDICATIVE + " and " + CODE_SHORT_CELLPHONE);
                this.create_value_async(current_user, CODE_FULL_CELLPHONE, new_value, id_profil, profil);
        }

    }

    // ############
    // RAW API CALL
    // ############

    // Pure profil API
    // ---------------

    xhttp_get_profils(email){
        var xhttp_back_api = new XMLHttpRequest();
        var url_final = url_all_profil.replace("{email}", email);
    
        xhttp_back_api.open("GET", url_final, true);
        xhttp_back_api.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp_back_api.send();
        return xhttp_back_api;
    }
    
    xhttp_create_profil(email, profil_name){
        var xhttp_back_api = new XMLHttpRequest();
        var url_final = url_create_profil.replace("{email}", email)
                                         .replace("{profilName}", profil_name);
    
        xhttp_back_api.open("POST", url_final, true);
        xhttp_back_api.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp_back_api.send();
        return xhttp_back_api;
    }

    xhttp_create_profil_value_user(email, pivot, value, profil_id){
        var xhttp_back_api = new XMLHttpRequest();
        //Don't forget to capitalize user value, and encode it
        var url_final = url_create_value_v6.replace("{email}", email)
                                        .replace("{pivot_name}", pivot)
                                        .replace("{value_text}", encodeURIComponent(value.capitalize()))
                                        .replace("{profil_id}", profil_id);
        xhttp_back_api.open("POST", url_final, true);
        xhttp_back_api.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp_back_api.send();
        return xhttp_back_api;
    }
        

    xhttp_update_weight(email, profil_id, new_weight){
        var xhttp_back_api = new XMLHttpRequest();
        var url_final = url_update_weight.replace("{email}", email)
                                         .replace("{profilId}", profil_id)
                                         .replace("{weight}", new_weight);

        xhttp_back_api.open("PUT", url_final, true);
        xhttp_back_api.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp_back_api.send();
        return xhttp_back_api;
    }


    
    xhttp_delete_profil(email, profil_id){
        var xhttp_back_api = new XMLHttpRequest();
        var url_final = url_profil.replace("{email}", email)
                                      .replace("{profilId}", profil_id);
    
        xhttp_back_api.open("DELETE", url_final, true);
        xhttp_back_api.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp_back_api.send();
        return xhttp_back_api;
    }
    
    // User value API
    // --------------
    
    
    //Return all values in a flat form
    xhttp_all_values_with_profil(email){
        var xhttp_back_api = new XMLHttpRequest();
        var url_final = url_all_values.replace("{email}", email);
    
        console.debug("Final url: " + url_final);
        xhttp_back_api.open("GET", url_final, true);
        xhttp_back_api.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp_back_api.send();
        return xhttp_back_api;
    }

    //This is async because we need to create the value id from back
    async fetch_create_profil_value_user(email, pivot, value, profil_id){
        //Don't forget to capitalize user value
        var url_final = url_create_value_v6.replace("{email}", email)
                                        .replace("{pivot_name}", pivot)
                                        .replace("{value_text}", encodeURIComponent(value.capitalize()))
                                        .replace("{profil_id}", profil_id);
        
        console.debug("Final url: " + url_final);

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

    // ##################
    // High Level method
    // ##################

    //Build profil object from JSON received from back-end
    build_profil_from_json(json_profil, json_values){

        console.debug("Starting building user profile...");
        console.debug("Raw profile object from back: " + JSON.stringify(json_profil, null, 4));
        console.debug("Raw user value with profile object from back: " + JSON.stringify(json_values, null, 4));

        //First, create all empty profil
        for(var index_profil in json_profil){
            var current_profil = json_profil[index_profil]

            var new_object_profil = {}

            new_object_profil["profilName"] = current_profil["profilName"];
            new_object_profil["weight"] = current_profil["weight"];

            this.profil_values[current_profil["profilId"]] = new_object_profil;
        }

        //Then, build user value object and add it in the corresponding profile
        for(var index_value in json_values){
            var current_value = json_values[index_value];

            var value_object = {};
            value_object["userValueId"] = current_value["userValueId"];
            //Don't forget to code value if it has been precedently encoded
            value_object["valueText"] = decodeURIComponent(current_value["value"]);

            var profil_id_value = current_value["profil"]["profilId"];
            var pivot_user_value = current_value["pivot"]["name"];

            //Don't capitalize email
            if(pivot_user_value != CODE_MAIN_EMAIL){
                value_object["valueText"] = value_object["valueText"].capitalize();
            }
            if( !(this.profil_values.hasOwnProperty(profil_id_value)) ){
                console.warn("The following user value claim to be related to profil: " + profil_id_value);
                console.warn("However, this profil cannot be found for user");
                console.warn("User value: " + JSON.stringify(value_object, null, 4));
            }else{
                this.profil_values[profil_id_value][pivot_user_value] = value_object;
            }
        }

        console.info("User profil has been initiated with following content: " + JSON.stringify(this.profil_values, null,4));
    }

    async add_value_to_profil(email, pivot, value_text, profil_id, callback){

        value_text = this.sanitize_new_user_value(pivot, value_text);

        var user_value_back = await this.fetch_create_profil_value_user(email, pivot, value_text, profil_id);
        console.debug("user value created from back: " + JSON.stringify(user_value_back, null, 4));

        var new_user_value = {};
        new_user_value["userValueId"] = user_value_back["userValueId"];
        new_user_value["valueText"] = value_text;
        this.profil_values[profil_id][pivot] = new_user_value;

        console.info("The following user value was added to profil " + profil_id + 
                     " on pivot " + pivot + " : " + JSON.stringify(new_user_value, null, 4));

        //Optional callback to execute after value creation
        if(callback != undefined){
            callback();
        }
    }
    
    get_value_for_pivot(profil_id, pivot_name){
        console.debug("try to get value from profil id " + profil_id + " on pivot: " + pivot_name);
        var profil = this.profil_values[profil_id];
        if( pivot_name in profil){
            return profil[pivot_name]["valueText"];
        }

        console.info("[get_value_for_pivot]: Could not find value in profil " + profil_id + " for pivot " + pivot_name);
        return false;
    }
    

    //Return a list containing pivot found in profil for value
    look_for_value_in_profil(profil_id, value){
        var profil_to_look = this.profil_values[profil_id];

        var res = [];

        for(var pivot in profil_to_look){
            //Be careful, there are others var than pivot in profil object
            //Make sure we are hitting a pivot
            if(liste_pivots.includes(pivot)){
                //Found the value we are looking for ! 
                if(profil_to_look[pivot]["valueText"] == value){
                    res.push(pivot);
                };
            }
        }
        return res;
    }

    /*Look for value in all profil.
    Aggregate the result and return a result as follow:
    {
        pivot1: <nb_occurences_value>,
        ...
        pivotn: <nb_occurences_value>
    }
    */
    look_for_value_all_profil(value){
        var profil_ids = this.get_id_all_profil();
        var obj_res = {};

        for(var index_profil=0 ; index_profil < profil_ids.length ; index_profil++){
            //For the sake of clarity
            var id_profil = profil_ids[index_profil];
            var res = this.look_for_value_in_profil(id_profil, value);

            for(var j=0 ; j<res.length ; j++){
                //Again, just for the sake of clarity
                var pivot = res[j];
                if(pivot in obj_res){
                    obj_res[pivot] = obj_res[pivot] + 1;
                }
                //First occurence of the pivot, creating it in object
                else{
                    obj_res[pivot] = 1;
                }
            }
        }
        console.debug("[look_for_value_all_profil]: Value " + value + 
            " found following correspondance " + JSON.stringify(obj_res, null, 4));
        return obj_res;
    }



    //Return a string to display a profil for input list
    get_display_value_string(profil_id){

        //email is mandatory
        var display_str = this.get_value_for_pivot(profil_id, "main_email");

        //Try to add family name and first if available
        var family_name = this.get_value_for_pivot(profil_id, "family_name");
        if( family_name != false){
            display_str += (" " + family_name);  
        }

        var first_name = this.get_value_for_pivot(profil_id, "first_name");
        if( family_name != false){
            display_str += (" " + first_name);  
        }
        return display_str;
    }

    //Return profil that should be displayed in the list for final user
    //Evolution: return list of profil sorted by weight, DESC
    //Evolution: execute by the way the pivot translation creation 
    get_profil_for_list(){
        var result_list = [];

        var profil_to_return = null;

        //If less or equal than number allowed, return all profil
        if( this.get_number_of_profil() <= nb_maximum_profil_restitution){
            profil_to_return = this.get_clone_profil_values();
        }else{
            //else, return profil with maximum weight
            var min_weight = 100;
            var min_id_profil = null;

            var profil_to_return = this.get_clone_profil_values();

            while(Object.keys(profil_to_return).length > nb_maximum_profil_restitution){
                
                //Find min weight profil in all list
                for (var id_profil in profil_to_return) {
                    var current_profil = this.profil_values[id_profil];
                    
                    if( current_profil["weight"] <= min_weight){
                        min_weight = current_profil["weight"];
                        min_id_profil = id_profil
                    }
                }

                //Delete weakest profil
                delete profil_to_return[min_id_profil];
                min_weight = 100;
            }
        }

        //Complete profils returned with translated pivots
        for (var id_profil in profil_to_return) {
            this.create_pivot_translated(id_profil);
        }

        //Build the list of profil to return 
        for (var id_profil in profil_to_return) {
            var new_obj = jsonCopy(this.profil_values[id_profil]);
            new_obj["id_profil"] = id_profil;
            result_list.push(new_obj);
        }
        //Sort list by weight, DESC
        result_list.sort(function(a,b) {
            return b.weight - a.weight;
        });

        return result_list;
    }

    /*
    Check if profil given in parameter does not already exist in db.

    {
        "profilName": "default2",
        "weight": 669.987,
        "first_name": {
            "userValueId": 20,
            "valueText": "tsointsoin"
        },
        "family_name": {
            "userValueId": 16,
            "valueText": "grassart"
        },
        "homephone": {
            "userValueId": 26,
            "valueText": "0320921500"
        }
    }

    */

    check_profil_existence(profil_to_check){

        for (var id_profil in this.profil_values) {
            var current_profil = this.profil_values[id_profil];
            
            var found_difference = false;
            for(var i in Object.keys(profil_to_check)){
                var pivot = Object.keys(profil_to_check)[i];

                if(liste_pivots.includes(pivot)){
                    //first possibility: key from profil to check is not found in current comparaison profil
                    //so this profil is not the same, continue to check
                    if( !(Object.keys(current_profil).includes(pivot)) ){
                        found_difference = true;
                        break;
                    }
                    
                    if(profil_to_check[pivot]["valueText"] != current_profil[pivot]["valueText"]){
                        found_difference = true;
                        break;
                    }
                }
            }
            //Find a profil with no difference than the one to check
            if(found_difference == false){
                return true;
            }
        }
        //Found no profil exactly the same
        return false;
    }

    //Check if the profil sent as parameter is eligible to creation 
    has_minimum_attribute(profil_test){
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

    //Add only in front a fake profil, which need to be created 
    //in back later on.
    add_fake_profil_front_only(profil){
        console.info("Saving fake profil in front");
        this.profil_values["0"] = profil;
        this.set_profil_storage();
    }

    //Add in defaut profil all user values in input profil
    complete_default_profil(profil){

        //First, get defaut profil
        var defaut_profil_id = this.get_default_profil_id();
        console.info("Defaut profil id = " + defaut_profil_id);
        var defaut_profil = this.profil_values[defaut_profil_id]

        console.info("Adding the following profil in defaut profil: ");
        console.info(JSON.stringify(profil, null, 4));
        //For each pivot, create value in back
        for(var pivot in profil){
            if(liste_pivots.includes(pivot)){
                this.create_value_async(current_user, pivot, profil[pivot]["valueText"], defaut_profil_id, profil)
            }
        }

        //When we are sure all requests has been sent to back, delete temps profil and save cache
        setTimeout(() => {
            delete this.profil_values["0"];
            this.set_profil_storage();
        }, 5000);

    }

    //If a fake temp profil has been created in front, this function
    //create it in back and save real profil id and user value id in front  
    //profil with id "0" is the special profil temp to be created
    create_profil_from_temp_profil(callback){

        //Abort if no temporary profil needs to be created
        if(!this.profil_values.hasOwnProperty("0")){
            return false;
        }

        var profil_name = "profil-" + guid();
        var profil = this.profil_values["0"];

        //If there is only one profil, the defaut profil we complete it and don't create a new profil
        //Minus 1 because we don't want to count the default profil
        if( (this.get_number_of_profil() -1) == 1){
            console.info("There is only the defaut profil and the temp profil.");
            console.info("Adding the temp profil in default profil and don't create a new profil.");
            this.complete_default_profil(profil);
            return true;
        }

        //Else, create a brand new profil

        console.info("[create_profil_from_temp_profil] Request profil back creation with name : " + profil_name);

        //This reference will be lost in xhttp object context
        var current_obj = this;

        //First, create a profil 
        var xhttp = this.xhttp_create_profil(current_user, profil_name);

        //Profil has been created in back
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                var data = xhttp.responseText;

                var json_data = JSON.parse(data)
                var new_profil_id = json_data["profilId"];

                var new_profil = jsonCopy(profil) ;
                new_profil["profilName"] = profil_name;
                new_profil["weight"] = json_data["weight"];

                var xhttp_user_value = {};

                //For each pivot, create value in back
                for(var pivot in new_profil){
                    if(liste_pivots.includes(pivot)){
                        new_profil[pivot]["valueText"] = current_obj.sanitize_new_user_value(pivot, new_profil[pivot]["valueText"]);
                        xhttp_user_value[pivot] = current_obj.xhttp_create_profil_value_user(current_user, pivot, new_profil[pivot]["valueText"], new_profil_id);
                    }
                }

                /*Note(BG): As I don't know in advance the different pivot to process, I had to do the requests with a composite
                object "xhttp_user_value" (as a map).
                I did not found a solution to listen to the result of the request by binding "onreadystatechange" listenner,
                because I need a loop and the loop is going to erase the pivot each time till the end of the loop, 
                meaning I will only listen to the last pivot.
                The workaround I found is below, to wait a bit and then do a loop on the result directly
                when I'm sure it's done. I guess there is a better way to do this...
                */

                //Hopefully, 5 seconds later all requests should be done
                setTimeout(function () {
                    for(var pivot in new_profil){
                        if(liste_pivots.includes(pivot)){
                            if(xhttp_user_value[pivot].responseText == undefined || 
                                xhttp_user_value[pivot].responseText == "" || 
                                xhttp_user_value[pivot].responseText == " "){
                                    console.warn("response text for pivot: " + pivot + " : " + xhttp_user_value[pivot].responseText);
                                    console.warn("Could not create user value, aborting profil creation");
                                    delete current_obj.profil_values["0"];
                                    return;
                                }
                            console.debug("response text for pivot: " + pivot + " : " + xhttp_user_value[pivot].responseText);
                            var response_json = JSON.parse(xhttp_user_value[pivot].responseText);
                            new_profil[pivot]["userValueId"] = response_json["userValueId"];
                        }
                    }
                    console.info("The temporary profil has been created in back and saved in front: " + JSON.stringify(new_profil, null, 4));
                    console.info("Profil id " + new_profil_id + " is now a regular profil");
                    current_obj.profil_values[new_profil_id] = new_profil;
                    delete current_obj.profil_values["0"];
                    current_obj.set_profil_storage();

                    if(callback){
                        callback();
                    }
                }, 6000);
            }
        }
    }
}

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

    var xhttp_profil = profil_db.xhttp_create_profil(user, "defaut_profil");

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
                profil_db.add_value_to_profil(user, CODE_MAIN_EMAIL, user, data["profilId"], init_event_list);
                console.info("[init_new_profil] Adding " + CODE_MAIN_EMAIL + " to default profil");
            }, timeout_profil_creation);
            
        }
    }
}
