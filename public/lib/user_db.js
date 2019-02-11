/*
Projet Corail
Auteur: Benjamin GRASSART
Année: 2018

user_db.js

Define classes which are objet db for front app.
CAREFUL: this librairy create user user value and update it.
It NEVER create pivot or manage it.
*/

var minimum_weigth_user_value = 0.40;
var coeff_decrease_user_value = 0.95;

var CODE_USER_VALUE_ID = "uservalue_id";
var CODE_USER_VALUE_TEXT = "value_text";
var CODE_USER_VALUE_WEIGTH = "weigth";

var WEIGTH_DEFAULT_CREATION = 1.0;

var WEIGTH_ADD_FOR_RESTITUTION = 0.4;
var WEIGTH_ADD_FOR_CHANGE = 1.2;

/*
Define a object db to save user values associated to pivot
Object js to save data is as below: 
{
    pivot_id1: [
        { uservalue_id, value_text, weigth},
        ...
        { uservalue_id, value_text, weigth}
    ],
    ...
    pivot_idn: [
        { uservalue_id, value_text, weigth},
        ...
        { uservalue_id, value_text, weigth}
    ],
}
*/


class UserPivotValues {
    constructor(user_pivot_value) {
        this.user_pivot_value = JSON.parse(user_pivot_value);

        //Turn all string in float for weigth
        for (var i in this.user_pivot_value) {
            for (var j = 0; j < this.user_pivot_value[i].length; j++) {
                this.user_pivot_value[i][j][CODE_USER_VALUE_WEIGTH] = string_to_float(this.user_pivot_value[i][j][CODE_USER_VALUE_WEIGTH]);
            }
        }

        this.logger = new Logger(CODE_FRONT_DB);
        this.logger.log("User values loaded from back: \n" + user_pivot_value);
    }

    //This is needed because user_pivot_value object from back
    //Does not include current_user
    set_current_user(email) {
        this.current_user = email;
    }

    /*
        Define primitive method for manipulating data
        ---------------------------------------------
    */

    //Check if pivot exist for current object
    has_value_for_pivot(pivot_name) {
        //Need ECMA 6 js
        return Object.keys(this.user_pivot_value).includes(pivot_name);
    }

    get_values_as_object(pivot_name) {
        if (!this.has_value_for_pivot(pivot_name)) {
            return null;
        }
        return this.user_pivot_value[pivot_name];
    }

    get_values_as_string(pivot_name, nb_indent) {
        var values_object = this.get_values_as_object(pivot_name);
        if (values_object != null) {
            if (nb_indent != undefined) {
                return JSON.stringify(values_object, null, nb_indent);
            }
            return JSON.stringify(values_object);
        }
        return null;
    }

    //Return value with the highest weigth 
    //CAREFUL: pivot must exist in front db for this method
    get_value_highest_weigth(pivot_name) {
        var values = this.user_pivot_value[pivot_name];

        if (values.length == 1) {
            return values[0][CODE_USER_VALUE_TEXT];
        }

        var highest_weigth = values[0][CODE_USER_VALUE_WEIGTH];
        var highest_value = values[0][CODE_USER_VALUE_TEXT];

        for (var i = 1; i < values.length; i++) {
            if (values[i][CODE_USER_VALUE_WEIGTH] > highest_weigth) {
                highest_weigth = values[i][CODE_USER_VALUE_WEIGTH];
                highest_value = values[i][CODE_USER_VALUE_TEXT];
            }
        }
        return highest_value;
    }

    //Create an object value for a text value
    //This is async because we need to wait for server return
    async create_user_value(pivot_name, value) {

        var json_response = await fetch_create_value_user(this.current_user, pivot_name, value);
        var new_object = {};
        new_object[CODE_USER_VALUE_ID] = json_response["userValueId"];
        new_object[CODE_USER_VALUE_TEXT] = value;
        new_object[CODE_USER_VALUE_WEIGTH] = WEIGTH_DEFAULT_CREATION;
        this.logger.log("create_user_value: creating: " + JSON.stringify(new_object, null, 4));
        this.user_pivot_value[pivot_name].push(new_object);

        return new_object;
    }

    //update weigth and delete user value if weigth is too low
    decrease_and_delete_user_value(pivot_name, id_weight_update, weigth_to_add, user_value_id_exclude) {
        //For the sake of clarity
        var user_values = this.user_pivot_value[pivot_name];

        //Will contain only element with weigth big enough (workaround to del elt)
        var new_user_value_list = [];
        for (var i = 0; i < user_values.length; i++) {
            //We can exclude a value from decreasing 
            if(user_values[i][CODE_USER_VALUE_ID] != user_value_id_exclude){
                user_values[i][CODE_USER_VALUE_WEIGTH] = user_values[i][CODE_USER_VALUE_WEIGTH] * coeff_decrease_user_value;
            }

            if (user_values[i][CODE_USER_VALUE_ID] == id_weight_update) {
                user_values[i][CODE_USER_VALUE_WEIGTH] = user_values[i][CODE_USER_VALUE_WEIGTH] + weigth_to_add;
            }

            //Del elt if weigth not big enough
            if (user_values[i][CODE_USER_VALUE_WEIGTH] < minimum_weigth_user_value) {
                xhttp_delete_value(user_values[i][CODE_USER_VALUE_ID]);
            } else {
                new_user_value_list.push(user_values[i]);
                xhttp_update_weight(user_values[i][CODE_USER_VALUE_ID], user_values[i][CODE_USER_VALUE_WEIGTH]);
            }
        }

        //End delete user value
        this.user_pivot_value[pivot_name] = new_user_value_list;
    }

    //Add a value for pivot
    async add_value_for_pivot(pivot_name, value) {
        //Create pivot entry in front db if needed
        if (!this.has_value_for_pivot(pivot_name)) {
            this.user_pivot_value[pivot_name] = [];
        }

        var new_object = await this.create_user_value(pivot_name, value);

        this.logger.log("Adding: " + JSON.stringify(new_object, null, 4));
        //Don't decrease this new value, sending fourth parameter
        this.decrease_and_delete_user_value(pivot_name, 0, 0, new_object[CODE_USER_VALUE_ID]);
        //this.user_pivot_value[pivot_name].push(new_object);
        return true;
    }

    //calculate new weigth for value associated with pivot
    //add value if not found
    async update_value_for_pivot(pivot_name, value, current_pivot_weight) {
        if (!this.has_value_for_pivot(pivot_name)) {
            console.error("FrontDB / update_value_for_pivot: " + pivot_name + " cannot be found");
            return false;
        }

        var values = this.user_pivot_value[pivot_name];
        var value_found = false;

        for (var i = 0; i < values.length; i++) {
            if (values[i][CODE_USER_VALUE_TEXT] == value) {
                //Don't update weigth here, decrease_and_delete_user_value will do :)
                this.decrease_and_delete_user_value(pivot_name, values[i][CODE_USER_VALUE_ID], WEIGTH_ADD_FOR_CHANGE, -1);
                value_found = true;
            }
        }

        if (!value_found && current_pivot_weight >= WEIGHT_MINIMUM_RESTITUTION) {
            console.info("[update_value_for_pivot] Current key pivot weight " + current_pivot_weight + 
                " is > " + WEIGHT_MINIMUM_RESTITUTION + ", adding new value for pivot");
            await this.add_value_for_pivot(pivot_name, value);
        }else if(!value_found && current_pivot_weight < WEIGHT_MINIMUM_RESTITUTION){
            console.info("[update_value_for_pivot] Current key pivot weight " + current_pivot_weight + 
            " is < " + WEIGHT_MINIMUM_RESTITUTION + ", cannot add new value for pivot");
        }
    }

    /*
        Define high-level method for operationnal process
        -------------------------------------------------
    */

    /* Return the good value for pivot requested or null if not found.
        Update weigth for user value.
        Delete user value if weigth < value in conf
        Update back-end for weigth.
    */

    value_restitution(pivot_dom_name) {
        if (!this.has_value_for_pivot(pivot_dom_name)) {
            return null;
        }
        var user_values = this.user_pivot_value[pivot_dom_name];

        //Update only current weigth and return value text
        if (user_values.length == 1) {

            //Don't restitute null or empty value
            var value_text = user_values[0][[CODE_USER_VALUE_TEXT]];
            if (value_text == "" || value_text == " ") {
                return null;
            }

            user_values[0][CODE_USER_VALUE_WEIGTH] *= coeff_decrease_user_value;
            user_values[0][CODE_USER_VALUE_WEIGTH] += WEIGTH_ADD_FOR_RESTITUTION;
            xhttp_update_weight(user_values[0][CODE_USER_VALUE_ID], user_values[0][CODE_USER_VALUE_WEIGTH]);
            return value_text;
        }

        //Else there are many values for this pivot
        //Find suitable value and update weigth
        var top_weigth = user_values[0][CODE_USER_VALUE_WEIGTH];
        var user_value_resti = user_values[0];

        //Find user value to restitute
        for (var i = 0; i < user_values.length; i++) {

            //If value is empty, delete it (decrease_and_delete_user_value)
            if (user_values[i][CODE_USER_VALUE_TEXT] == "" || user_values[i][CODE_USER_VALUE_TEXT] == " ") {
                user_values[i][CODE_USER_VALUE_WEIGTH] = 0;
            }

            if (user_values[i][CODE_USER_VALUE_WEIGTH] > top_weigth) {
                top_weigth = user_values[i][CODE_USER_VALUE_WEIGTH];
                user_value_resti = user_values[i];
            }
        }

        this.decrease_and_delete_user_value(pivot_dom_name, user_value_resti[CODE_USER_VALUE_ID], WEIGTH_ADD_FOR_RESTITUTION, -1);

        return user_value_resti[CODE_USER_VALUE_TEXT];
    }


    //Apply a change for input when pivot exist in domain
    async change_value_pivot_trouve_domaine(key_domain, pivot_dom_name, new_value, current_pivot_weight) {

        //User has already this pivot, check if highest value has changed
        if (this.has_value_for_pivot(pivot_dom_name)) {

            this.logger.log("Found pivot " + pivot_dom_name + "for user.");
            this.logger.log("Values associated: " + this.get_values_as_string(pivot_dom_name));

            var old_highest_value = this.get_value_highest_weigth(pivot_dom_name);
            await this.update_value_for_pivot(pivot_dom_name, new_value, current_pivot_weight);
            var new_highest_value = this.get_value_highest_weigth(pivot_dom_name);

            this.logger.log("Front DB: User has pivot " + pivot_dom_name + ". " +
                "After updating values, pivot: \n" + this.get_values_as_string(pivot_dom_name));

            if (old_highest_value != new_highest_value) {
                this.logger.log("Found " + pivot_dom_name + " for user. Value with highest weight has changed.");
            }
        }
        //Create new pivot and add value
        else {
            this.user_pivot_value[pivot_dom_name] = [];
            if( current_pivot_weight >= WEIGHT_MINIMUM_RESTITUTION ){
                var new_object = await this.create_user_value(pivot_dom_name, new_value);
                this.logger.log("[change_value_pivot_trouve_domaine] creating object user value: " + new_object);
            }
            this.logger.log("Cannot find pivot " + pivot_dom_name + " for user.");
        }
    }

    /*Implement a method to return pivot found for user value
      associated with weight.
      Result form:
      {
        "first_name": 3.2,
        "pseudo": 1
      }
    */
    get_pivot_weight_from_values(value_researched) {
        var result = {};
        console.log("[Get_pivot_weight_from_values]: Looking for user value: " + value_researched);
        for (var pivot in this.user_pivot_value) {
            for (var user_value_index = 0; user_value_index < this.user_pivot_value[pivot].length; user_value_index++) {
                var line_user_value = this.user_pivot_value[pivot][user_value_index];
                if (line_user_value["value_text"] == value_researched) {
                    result[pivot] = line_user_value[CODE_USER_VALUE_WEIGTH];
                }
            }
        }
        console.log("[Get_pivot_weight_from_values]:Pivot weight found: " + JSON.stringify(result, null, 4));
        return result;
    }

    //Return all pivots with a values associated, whatever it is
    get_pivot_with_values(){
        var result = [];
        for (var pivot in this.user_pivot_value) {
            var pivot_list_values = this.user_pivot_value[pivot];
            //Return pivot if not empty
            if (pivot_list_values.length > 0) {
                result.push(pivot);
            }
        }
        console.log("[get_pivot_with_values]: Pivot found with values: " + JSON.stringify(result, null, 4));
        return result;
    }
}




