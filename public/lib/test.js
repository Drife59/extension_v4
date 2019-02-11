//var front_db = require('./user_db.js');
var config = require('../config.js');

/*
____________  ___  ___  ___ _____ _    _  ___________ _   __  _____ _____ _____ _____ 
|  ___| ___ \/ _ \ |  \/  ||  ___| |  | ||  _  | ___ \ | / / |_   _|  ___/  ___|_   _|
| |_  | |_/ / /_\ \| .  . || |__ | |  | || | | | |_/ / |/ /    | | | |__ \ `--.  | |  
|  _| |    /|  _  || |\/| ||  __|| |/\| || | | |    /|    \    | | |  __| `--. \ | |  
| |   | |\ \| | | || |  | || |___\  /\  /\ \_/ / |\ \| |\  \   | | | |___/\__/ / | |  
\_|   \_| \_\_| |_/\_|  |_/\____/ \/  \/  \___/\_| \_\_| \_/   \_/ \____/\____/  \_/  
                                                                                                                                                                            
*/

//Sample front db example. To be modified if needed 
var user_value_test = `{
    "first_name": [
        {
        "uservalue_id": "1842",
        "value_text": "Benjamin",
        "weigth": "3,2000"
        },
        {
            "uservalue_id": "1898",
            "value_text": "Maxence",
            "weigth": "0,8000"
        }
    ],
    "first_name_bis": [
        {
        "uservalue_id": "1842",
        "value_text": "Maxence",
        "weigth": "1,0000"
        }
    ],
    "pseudo": [
        {
        "uservalue_id": "1899",
        "value_text": "Benjamin",
        "weigth": "1,0000"
        }
    ],
    "main_email": [
        {
        "uservalue_id": "1849",
        "value_text": "benjamingrassart@togetheer.com",
        "weigth": "0,7"
        },
        {
        "uservalue_id": "3954",
        "value_text": "bjbtiben@gmail.com",
        "weigth": "0,2600"
        },
        {
        "uservalue_id": "3982",
        "value_text": "benjamin.grassart@gmail.com",
        "weigth": "2,100"
        },
        {
        "uservalue_id": "3983",
        "value_text": "benjamin.grassart@orange.fr",
        "weigth": "1,7000"
        }
    ]
}`;


// Local value for setup, to be modified by Ju for each test session
//Override value at the beginning of the file

//var user_value_pivot_test = new front_db.UserPivotValues(user_value_test, 15);

//Permet de tester l'évolution des valeurs lors de restitutions
/*function evolution_value_restitution(nb_restitution, name_field){
    console.log("\n#####################################");
    console.log("FONCTION D'ETUDE D'IMPACT RESTITUTION");
    console.log("#####################################");
    console.log("\nLe champ étudié: " + name_field + " sur " + nb_restitution + " occurences.");
    console.log("Etat de la front base avant restitution: " + user_value_pivot_test.get_values_as_string(name_field, 4));

    for( var i=0 ; i<nb_restitution ; i++){
        user_value_pivot_test.value_restitution(name_field);
    }
    console.log("Etat de la front base après restitution: " + user_value_pivot_test.get_values_as_string(name_field, 4));
}*/


// Local test execution, here choose your scenario Ju
//evolution_value_restitution(30, "main_email");


// Here local test Dev for Ben

//user_value_pivot_test.change_value_pivot_trouve_domaine("last_name", "Garau");
//console.log(user_value_pivot_test.get_values_as_string("last_name", 4));
//user_value_pivot_test.change_value_pivot_trouve_domaine("last_name", "Grassart");

//user_value_pivot_test.change_value_pivot_trouve_domaine("first_name", "Maxence");


//console.log(user_value_pivot_test.get_value_highest_weigth("main_email"));

var minimum_weigth_user_value = 0.40;
var coeff_decrease_user_value = 0.95;

var CODE_USER_VALUE_ID     = "uservalue_id";
var CODE_USER_VALUE_TEXT   = "value_text";
var CODE_USER_VALUE_WEIGTH = "weigth";

var WEIGTH_DEFAULT_CREATION = 1.0;

var WEIGTH_ADD_FOR_RESTITUTION = 0.4;
var WEIGTH_ADD_FOR_CHANGE = 1.2;

//Return number from string as float
function string_to_float(string_number){
	return parseFloat(string_number.replace(",", "."));
}

class UserPivotValuesTest{
    constructor(user_pivot_value){
        this.user_pivot_value = JSON.parse(user_pivot_value);

        //Turn all string in float for weigth
        for(var i in this.user_pivot_value ){
            for(var j=0 ; j<this.user_pivot_value[i].length ; j++){
                this.user_pivot_value[i][j][CODE_USER_VALUE_WEIGTH] = 
                    string_to_float(this.user_pivot_value[i][j][CODE_USER_VALUE_WEIGTH]);
            }
        }

        console.log(JSON.stringify(this.user_pivot_value, null, 4));
    }

    get_pivot_weight_from_values(value_researched){
        var result = {};
        console.log("Looking for value: " + value_researched);
        for(var pivot in this.user_pivot_value ){
            for(var user_value_index=0 ; user_value_index<this.user_pivot_value[pivot].length ; user_value_index++){
                var line_user_value = this.user_pivot_value[pivot][user_value_index];
                if(line_user_value["value_text"] == value_researched){
                    console.log("Pivot " + pivot + " found with weight: " + line_user_value[CODE_USER_VALUE_WEIGTH]);
                    result[pivot] = line_user_value[CODE_USER_VALUE_WEIGTH];
                }
            }
        }
        console.log("Final result: " + JSON.stringify(result, null, 4));
        return result;
    }
}

var user_value_pivot_test = new UserPivotValuesTest(user_value_test);
user_value_pivot_test.get_pivot_weight_from_values("Benjamin");
user_value_pivot_test.get_pivot_weight_from_values("benjamin.grassart@gmail.com");

