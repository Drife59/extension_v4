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

    //Save in storage current UserProfil
    set_profil_storage(){
        chrome.storage.sync.set({"current_user": this.current_user});
        chrome.storage.sync.set({"profil_user_values": JSON.stringify(this.profil_values)});
        console.info("Set profil user db in google storage");
    }

    //Load UserProfil object from local storage
    get_profil_storage(){
        //To handle the change of context
        var current_obj = this;
        chrome.storage.sync.get("profil_user_values", function (data) {
            if (typeof data.profil_user_values !== 'undefined') {
                current_obj.profil_values = JSON.parse(data.profil_user_values);
                console.info("[get_profil_storage]Loaded profil user value from cache: " + 
                    JSON.stringify(current_obj.profil_values, null, 4))
            } else {
                console.warn("[get_profil_storage] Could not load profil user value from cache");
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
                                        .replace("{value_text}", value.capitalize())
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
            value_object["valueText"] = current_value["value"];

            var profil_id_value = current_value["profil"]["profilId"];
            var pivot_user_value = current_value["pivot"]["name"];

            //Don't capitalize email
            if(pivot_user_value != CODE_MAIN_EMAIL){
                value_object["valueText"] = current_value["value"].capitalize();
            }
            this.profil_values[profil_id_value][pivot_user_value] = value_object;
        }

        console.info("User profil has been initiated with following content: " + JSON.stringify(this.profil_values, null,4));
    }

    async add_value_to_profil(email, pivot, value_text, profil_id){

        var user_value_back = await this.fetch_create_profil_value_user(email, pivot, value_text, profil_id);
        console.debug("user value created from back: " + JSON.stringify(user_value_back, null, 4));

        var new_user_value = {};
        new_user_value["userValueId"] = user_value_back["userValueId"];
        new_user_value["valueText"] = value_text;
        this.profil_values[profil_id][pivot] = new_user_value;

        console.info("The following user value was added to profil " + profil_id + 
                     " on pivot " + pivot + " : " + JSON.stringify(new_user_value, null, 4));

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
        if( family_name != null){
            display_str += (" " + family_name);  
        }

        var first_name = this.get_value_for_pivot(profil_id, "first_name");
        if( family_name != null){
            display_str += (" " + first_name);  
        }
        return display_str;
    }

    //Return profil that should be displayed in the list for final user
    get_profil_for_list(){
        //If less or equal than number allowed, return all profil
        if( this.get_number_of_profil() <= nb_maximum_profil_restitution){
            return this.profil_values;
        }

        //else, return profil with maximum weight
        var min_weight = 100;
        var min_id_profil = null;

        var result = this.get_clone_profil_values();

        while(Object.keys(result).length > nb_maximum_profil_restitution){
            
            //Find min weight profil in all list
            for (var id_profil in result) {
                var current_profil = this.profil_values[id_profil];
                
                if( current_profil["weight"] <= min_weight){
                    min_weight = current_profil["weight"];
                    min_id_profil = id_profil
                }
            }

            //Delete weakest profil
            delete result[min_id_profil];
            min_weight = 100;
        }
        return result;
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
            
            //Not the same user value number, not the same profil
            if(Object.keys(profil_to_check).length != Object.keys(current_profil).length){
                continue;
            }

            var found_difference = false;
            for(var i in Object.keys(profil_to_check)){
                var pivot = Object.keys(profil_to_check)[i];

                if(liste_pivots.includes(pivot)){
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
}
