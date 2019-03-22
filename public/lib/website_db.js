/*
Projet Corail
Auteur: Benjamin GRASSART
Année: 2018

website_db.js

Define classes which are website db for front app.
It NEVER create pivot or manage it.
*/

/*
Define a object db to save website keys and associated weight for pivot
Object js to save data is as below: 
{
    <domaine1>: {
		<cle1>: {
			family_name: coeff_correspondance,
			first_name: coeff_correspondance,
			pivot_age: coeff_correspondance,
			...
			pivot_referent: "nom"
		}
		<cle2>: { ... }
		...
		<cle n>: { ... }
	}
	...
	<domaine n>: { ... }
}
*/

var exemple_domain_key = `
{
    "www.cdiscount.com": {
		"nom_fam_txt": {
			"family_name": 70,
			"first_name": 30,
            "day_of_birth": 0,
            "month_of_birth": -100,
            "year_of_birth": -100,
			"pivot_referent": null
        },
        "prenom_txt": {
			"family_name": 60,
			"first_name": 100,
            "day_of_birth": 0,
            "month_of_birth": -100,
            "year_of_birth": -100,
			"pivot_referent": "prenom"
        },
        "jour_naissance_txt": {
			"family_name": 30,
			"first_name": 0,
            "day_of_birth": 70,
            "month_of_birth": 70,
            "year_of_birth": 0,
			"pivot_referent": "jour_naissance"
        },
        "mois_naissance_txt": {
			"family_name": 30,
			"first_name": 70,
            "day_of_birth": 100,
            "month_of_birth": 100,
            "year_of_birth": 0,
			"pivot_referent": "mois_naissance"
        }
    }
}
`

//----------
//config dev
//----------

//Config just for dev, to be commented later
//This config is needed for tests as we don't want to import config file here
//Careful, this as a copy paste from config file

/*
//Website front DB setup
var MIN_KEY_PIVOT_WEIGHT = -100;
var MAX_KEY_PIVOT_WEIGHT = 100;

//if > to the var below, a key is considered associated to pivot 
var VALIDATED_ASSOCIATION_WEIGHT = 45;

//Weight set when creating pivot with heuristic
var HEURISTIC_BASE_WEIGHT = 45;

var CODE_PIVOT_REFERENT = "pivot_referent";

//This is the code we use to identify type of field
//firstname, lastname, postalcode, city, tel
//Correspond to field "name" in Pivots table
var CODE_FIRSTNAME = "first_name";
var CODE_LASTNAME = "family_name";
var CODE_POSTALCODE = "postal_code";
var CODE_CITY = "home_city";
var CODE_CELLPHONE = "cellphone_number";
var CODE_MAIN_EMAIL = "main_email";
var CODE_MAIN_FULL_ADDRESS = "main_full_address";
var CODE_DAY_BIRTH = "day_of_birth";
var CODE_MONTH_BIRTH = "month_of_birth";
var CODE_YEAR_BIRTH = "year_of_birth";

//V3.3 Heuristic
var CODE_COMPANY = "company";
var CODE_HOMEPHONE = "homephone";
var CODE_CVV_STRING = "cvv";
var CODE_CARDEXPIRYMONTH = "cardexpirymonth";
var CODE_CARDEXPIRYYEAR = "cardexpiryyear";

//V4.0 Heuristic
var CODE_FULL_BIRTHDATE = "full_birthdate";

//This code in is in db, does not correspond to "pivot name" field
var CODE_RESEARCH = "research";

*/

// -----------------
// End of config dev
// -----------------

var liste_pivots = [CODE_MAIN_EMAIL, CODE_FIRSTNAME, CODE_LASTNAME,
    CODE_POSTALCODE, CODE_CITY, CODE_MAIN_FULL_ADDRESS,
    CODE_CELLPHONE, CODE_HOMEPHONE,
    CODE_DAY_BIRTH, CODE_MONTH_BIRTH, CODE_YEAR_BIRTH, CODE_FULL_BIRTHDATE,
    CODE_COMPANY
    //CODE_CVV_STRING, CODE_CARDEXPIRYMONTH, CODE_CARDEXPIRYYEAR
]

//Function below just for test, to be deleted later
//Return number from string as float
/*function string_to_float(string_number) {
    return parseFloat(string_number.replace(",", "."));
}*/

class WebsiteDb {
    constructor(domain_key_text) {
        this.website_key = JSON.parse(domain_key_text);

        //Turn all string in int for weight
        for (var i in this.website_key) {
            for (var j in this.website_key[i]) {
                for (var k in this.website_key[i][j]) {
                    if (k == CODE_PIVOT_REFERENT) {
                        continue;
                    }
                    this.website_key[i][j][k] = parseInt(this.website_key[i][j][k])
                }
            }
        }
    }

    get_weight_pivot(domain, key, pivot){
        return this.website_key[domain][key][pivot];
    }

    //Get a string to display for a key, 
    get_notable_weight(key_content){
        var res_obj = {}
        for (var pivot in key_content) {
            if (pivot == CODE_PIVOT_REFERENT || key_content[pivot] > 0) {
                res_obj[pivot] = key_content[pivot];
            }
        }
        return res_obj;
    }

    get_all_key_minimal_display(){
        var result = {};
        for (var i in this.website_key) {
            console.debug("website: " + i);
            for (var key_domain in this.website_key[i]){
                result[key_domain] = this.get_notable_weight(this.website_key[i][key_domain]);
            }
        }
        return JSON.stringify(result, null, 4);
    }

    /*
        Define primitive method for manipulating data
        ---------------------------------------------
    */

    //Must be absolute alone max, if not return null
    get_max_weight(website_domain, key) {
        var weight_pivot = this.website_key[website_domain][key];
        if (weight_pivot == undefined)
            return false;

        var max = MIN_KEY_PIVOT_WEIGHT;
        //var max = -100;
        var pivot = null;

        for (var i in weight_pivot) {
            if (weight_pivot[i] > max) {
                max = weight_pivot[i];
                pivot = i;
            }
        }

        //Check if same max weight is found for another pivot
        //If that so, then max pivot is null
        for (var i in weight_pivot) {
            if (weight_pivot[i] == max && i != pivot) {
                pivot = null;
            }
        }
        return {
            pivot: pivot,
            weight: max
        }
    }

    //get corresponding referent pivot for a key if exist and if association score if high enough
    get_referent_pivot(domain, key) {
        if (!this.has_key(domain, key)) {
            console.warn("Key " + key + " for domain " + domain + " does not exist.");
            return null;
        }
        var pivot_weight = this.get_max_weight(domain, key);

        //Weight is not enough
        if (pivot_weight["weight"] < VALIDATED_ASSOCIATION_WEIGHT) {
            return null;
        }
        return pivot_weight["pivot"];
    }

    //Compute and set in front db the referent pivot in dedicated field
    compute_and_set_referent_pivot(domain, key){
        this.website_key[domain][key][CODE_PIVOT_REFERENT] = this.get_referent_pivot(domain, key);
    }

    //Set pivot referent for a key. Don't compute anything
    set_referent_pivot(domain, key, pivot){
        this.website_key[domain][key][CODE_PIVOT_REFERENT] = pivot;
    }

    has_domain(domain) {
        return this.website_key.hasOwnProperty(domain);
    }

    has_key(domain, key) {
        if (!this.website_key.hasOwnProperty(domain)) {
            return false;
        }
        return this.website_key[domain].hasOwnProperty(key);
    }

    //Add a new domain section from back
    add_domain_from_back(domain, keys_txt) {
        var keys_json = JSON.parse(keys_txt);

        var result = {};
        for (var index_key in keys_json) {
            var result_key = {};
            //Copy all weight values for current key
            for (var j in liste_pivots) {
                var current_pivot = liste_pivots[j];
                result_key[current_pivot] = keys_json[index_key][current_pivot];
            }
            //just for the sake of clarity
            var code_key = keys_json[index_key]["code"];
            result[code_key] = result_key;
        }
        console.info("Successfully inserted keys from domain " + domain);
        this.website_key[domain] = result;
    }

    //Create a new key for domain, with boostraping value
    //If key already exist, forbid action
    create_key(domain, key, heuristic_ref) {
        if (!this.has_domain(domain)) {
            console.warn("Create key: domain does not exist");
            return false;
        }

        if (this.has_key(domain, key)) {
            console.debug("Cannot create key: key already exist for domain");
            return false;
        }

        var new_key_content = {};
        var pivot = null;
        for (var i in liste_pivots) {
            pivot = liste_pivots[i];
            //if no heuristic found, set all weight to 0
            if (heuristic_ref == null || heuristic_ref == "undefined") {
                new_key_content[pivot] = 0;
            }
            //Else set all weight to the one for heuristic detected
            else {
                if (pivot == heuristic_ref) {
                    new_key_content[pivot] = HEURISTIC_BASE_WEIGHT;
                } else {
                    new_key_content[pivot] = -HEURISTIC_BASE_WEIGHT;
                }
            }
        }
        console.debug("[create_key] New key was created with content : " + JSON.stringify(new_key_content, 4));
        this.website_key[domain][key] = new_key_content;


        //Make request against back
        //-------------------------

        var key_obj = createEmptyKeyRequestObject(key);

        if( heuristic_ref !== undefined){
            //code_heuristique is the corresponding pivot we found
            key_obj["pivot_reference"] = heuristic_ref;
            //We associate this pivot with the corresponding weight
            key_obj[heuristic_ref] = HEURISTIC_BASE_WEIGHT;
        }
        //Creating key without knowing the referent pivot
        else{
            key_obj["pivot_reference"] = null;
        }
            
        console.debug("Key obj we are going to send: " + JSON.stringify(key_obj, null, 4));

        var xhttp_dom_create = xhttp_add_key_domain(key_obj);

        xhttp_dom_create.onreadystatechange = function () {
            if (xhttp_dom_create.readyState == 4 && xhttp_dom_create.status == 200) {
                console.info("Create key " + key + 
                    " on domain with matching heuristic " + heuristic_ref);
            }
        }
        return true;
    }

    /* Calculate new weight when apply a pivot found from user
     * input: objet representing pivots found for the user value associated 
     * with their weight:
     * {
     *      "nom": "2.3",
     *      "prenom": "4.5"
     * }
     */
    apply_pivot_on_key(domain, key, pivot_weight, pivots_with_values) {
        var weights_website = this.website_key[domain][key];

        //Ensure weight are float
        for (var i in pivot_weight) {
            pivot_weight[i] = string_to_float(pivot_weight[i]);
        }

        if( Object.keys(pivot_weight).length > 0){
            console.info("Matching between pivot value and entered value");
            console.debug("Pivot weight found for user value. Executing \"classical\" algoritm");
        }

        //If pivot weight (from user) is not empty, apply classical algoritm
        for (var pivot_user in pivot_weight) {

            var old_weight = weights_website[pivot_user];

            //coeff represent multiplicatof for ajusting key pivot weight
            // 5 = want to validate association, 2 = want to increase association
            var coeff = 2;
            if (old_weight < VALIDATED_ASSOCIATION_WEIGHT) {
                coeff = 5;
            }

            //Increase pivot found
            var new_weight = Math.round(old_weight + coeff * pivot_weight[pivot_user]);

            if (new_weight > MAX_KEY_PIVOT_WEIGHT) {
                new_weight = MAX_KEY_PIVOT_WEIGHT;
            }
            weights_website[pivot_user] = new_weight;

            //Decrease others pivots, if not present for user value
            for (var pivot_website in weights_website) {
                if (pivot_website == CODE_PIVOT_REFERENT) {
                    continue;
                }
                if (Object.keys(pivot_weight).includes(pivot_website)) {
                    continue;
                }
                //Minus exact adding for increase pivot
                //weights_website[pivot_website] = weights_website[pivot_website] - coeff * pivot_weight[pivot_user];
                //Minus 25 as in spec
                weights_website[pivot_website] = weights_website[pivot_website] - 25;

                if (weights_website[pivot_website] < MIN_KEY_PIVOT_WEIGHT)
                    weights_website[pivot_website] = MIN_KEY_PIVOT_WEIGHT;
            }
        }

        //If pivot weight (from user) is empty, set all weight as minus 5 if weight < restitution weight (60 as today)
        if( Object.keys(pivot_weight).length === 0){
            console.info("No pivot weight found for user value. Executing \"minus 5\" algoritm");

            //Decrease others pivots, if not present for user value
            for (var pivot_website in weights_website) {
                if (pivot_website == CODE_PIVOT_REFERENT) {
                    continue;
                }
                if (Object.keys(pivot_weight).includes(pivot_website)) {
                    continue;
                }
                //@Julien
                //Il faut que -5 puisse s'appliquer jusqu'à 100...parce que sinon, cela veut dire qu'un score ne peut jamais baisser une fois qu'il est >60 
                //(sauf si la valeur est présente dans un autre pivot, ce qui n'est pas forcement le cas)...et cela peut être dangereux pour l'apprentissage                // So deleting condition
                
                //Don't minus 5 if pivots has values for user
                if (!pivots_with_values.includes(pivot_website)) {
                    continue;
                }
                weights_website[pivot_website] = weights_website[pivot_website] - 5;

                if (weights_website[pivot_website] < MIN_KEY_PIVOT_WEIGHT)
                    weights_website[pivot_website] = MIN_KEY_PIVOT_WEIGHT;
            }
        }

        //Finally update weight
        this.website_key[domain][key] = weights_website;
        //For the key, calculate again reference pivot
        this.compute_and_set_referent_pivot(domain, key);
        console.info("[apply_pivot_on_key] After update, key content is " + this.display_key_weight(domain, key));


        //Update Back part
        //----------------

        //Clone key to update
        var key_request = JSON.parse(JSON.stringify(this.website_key[domain][key]));
        key_request["cle"] = key;

        //We need to wait a bit for the key update, because it could have just be created
        //The server need some time to be able to fully create it and retrieve it
        setTimeout(function(){ 
            console.debug("[apply_pivot_on_key]: Updating back-end with object key.");
            xhttp_put_key_domain(key_request);
        },1000);
    }

    //Display the weight associated with key, rounded
    display_key_weight(domain, key){
        //Clone original object
        var weights = JSON.parse(JSON.stringify(this.website_key[domain][key]));

        for(var weight in weights){
            if(weight == CODE_PIVOT_REFERENT)
                continue;
            weights[weight] = weights[weight].toFixed(2);
        }
        return JSON.stringify(weights);
    }
}

var test_pivot_weight = {
    "first_name": "2.5",
    "family_name": "2"
}

var test_website_key = new WebsiteDb(exemple_domain_key);
//console.log(test_website_key.get_max_weight("www.cdiscount.com", "prenom_txt"));
//console.log(test_website_key.website_key["www.cdiscount.com"]["prenom_txt"]);
//test_website_key.apply_pivot_on_key("www.cdiscount.com", "prenom_txt", test_pivot_weight);
//console.log(test_website_key.get_max_weight("www.cdiscount.com", "prenom_txt"));


/*

//Check on referent pivot calculation
console.log(test_website_key.get_referent_pivot("www.cdiscount.com", "nom_fam_txt"));
console.log(test_website_key.get_referent_pivot("www.cdiscount.com", "prenom_txt"));
console.log(test_website_key.get_referent_pivot("www.cdiscount.com", "jour_naissance_txt"));

//For now, nom_fam_txt has a pivot referent null
console.log("Before set referent pivot, nom_fam_txt: \n");
console.log(test_website_key.website_key["www.cdiscount.com"]["nom_fam_txt"]);

test_website_key.compute_and_set_referent_pivot("www.cdiscount.com", "nom_fam_txt");

//Expecting having pivot_referent as nom_fam_txt
console.log("After set referent pivot, nom_fam_txt: \n");
console.log(test_website_key.website_key["www.cdiscount.com"]["nom_fam_txt"]);

//Set back family name pivot reference as null
test_website_key.website_key["www.cdiscount.com"]["nom_fam_txt"]["pivot_referent"] = null;

test_pivot_weight = {
    "first_name": "1",
    "family_name": "2"
}
//expecting again pivot reference as null
console.log("\nSet back pivot referent as null");
console.log(test_website_key.website_key["www.cdiscount.com"]["nom_fam_txt"]);
test_website_key.apply_pivot_on_key("www.cdiscount.com", "nom_fam_txt", test_pivot_weight);

console.log("\nExecuting apply_pivot_on_key on nom_fam_txt");
console.log(test_website_key.website_key["www.cdiscount.com"]["nom_fam_txt"]);

*/

//Check with full fonctionnality as call API


//Test call API real life
//-----------------------

//New website DB empty

/*
test_website_key = new WebsiteDb("{}");

const http = require('http');

http.get('http://localhost:1665/website/www.cdiscount.com/keys', (resp) => {
    let data = '';

    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
        data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
        test_website_key.add_domain_from_back("www.cdiscount.com", data);

        http.get('http://localhost:1665/website/www.abc.com/keys', (resp) => {
            let data = '';

            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                test_website_key.add_domain_from_back("www.abc.com", data);
                console.log("Final content in object: " + JSON.stringify(test_website_key.website_key, null, 4));
            });

        })
    });
});
*/