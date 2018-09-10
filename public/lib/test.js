var front_db = require('./front_db.js');

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
        "weigth": "1,0000"
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

var user_value_pivot_test = new front_db.UserPivotValues(user_value_test, 15);

//Permet de tester l'évolution des valeurs lors de restitutions
function evolution_value_restitution(nb_restitution, name_field){
    console.log("\n#####################################");
    console.log("FONCTION D'ETUDE D'IMPACT RESTITUTION");
    console.log("#####################################");
    console.log("\nLe champ étudié: " + name_field + " sur " + nb_restitution + " occurences.");
    console.log("Etat de la front base avant restitution: " + user_value_pivot_test.get_values_as_string(name_field, 4));

    for( var i=0 ; i<nb_restitution ; i++){
        user_value_pivot_test.value_restitution(name_field);
    }
    console.log("Etat de la front base après restitution: " + user_value_pivot_test.get_values_as_string(name_field, 4));
}


// Local test execution, here choose your scenario Ju
//evolution_value_restitution(30, "main_email");


// Here local test Dev for Ben

//user_value_pivot_test.change_value_pivot_trouve_domaine("last_name", "Garau");
//console.log(user_value_pivot_test.get_values_as_string("last_name", 4));
//user_value_pivot_test.change_value_pivot_trouve_domaine("last_name", "Grassart");

//console.log(user_value_pivot_test.get_pivots_to_merge_from_value("Benjamin"));
//console.log(user_value_pivot_test.get_pivots_to_merge_from_value("benjamin.grassart@gmail.com"));

//user_value_pivot_test.change_value_pivot_trouve_domaine("first_name", "Maxence");


//console.log(user_value_pivot_test.get_value_highest_weigth("main_email"));
