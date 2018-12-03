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

var exemple_domaine_key = `
{
    "www.cdiscount.com": {
		"nom_fam_txt": {
			"family_name": 100,
			"first_name": 30,
            "day_of_birth": 0,
            "month_of_birth": -100,
            "year_of_birth": -100,
			"pivot_referent": "nom"
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
            "day_of_birth": 100,
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
    },
    "www.rueducommerce.com": {
		"nom_fam_txt": {
			"family_name": 100,
			"first_name": 30,
            "day_of_birth": -100,
            "month_of_birth": -100,
            "year_of_birth": -100,
			"pivot_referent": "nom"
        },
        "prenom_txt": {
			"family_name": 60,
			"first_name": 100,
            "day_of_birth": -100,
            "month_of_birth": -100,
            "year_of_birth": -100,
			"pivot_referent": "prenom"
        }
    }
}
`

//Config just for dev, to be deleted later

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
var CODE_LASTNAME  = "family_name";
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

var liste_pivots = [CODE_MAIN_EMAIL, CODE_FIRSTNAME, CODE_LASTNAME,
                    CODE_POSTALCODE, CODE_CITY, CODE_MAIN_FULL_ADDRESS,
                    CODE_CELLPHONE, CODE_HOMEPHONE,
                    CODE_DAY_BIRTH, CODE_MONTH_BIRTH, CODE_YEAR_BIRTH, CODE_FULL_BIRTHDATE,
                    CODE_COMPANY,
                    CODE_CVV_STRING, CODE_CARDEXPIRYMONTH, CODE_CARDEXPIRYYEAR
    ]

//Function below just for test, to be deleted later
//Return number from string as float
function string_to_float(string_number){
	return parseFloat(string_number.replace(",", "."));
}

class WebsiteDb{
    constructor(domaine_key_text){
        this.website_key = JSON.parse(domaine_key_text);

        //Turn all string in int for weight
        for(var i in this.website_key ){
            for(var j in this.website_key[i] ){
                for(var k in this.website_key[i][j] ){
                    if( k == CODE_PIVOT_REFERENT ){
                        continue;
                    }
                    this.website_key[i][j][k] = parseInt(this.website_key[i][j][k])
                }
            }
        }

        //this.logger = new Logger(CODE_FRONT_DB);
        //this.logger.log("User values loaded from back: \n" + user_pivot_value);
    }

    /*
        Define primitive method for manipulating data
        ---------------------------------------------
    */

    //Must be absolute alone max, if not return null
    get_max_weight(website_domain, key){
        var weight_pivot = this.website_key[website_domain][key];
        if (weight_pivot == undefined)
            return false;

        var max = MIN_KEY_PIVOT_WEIGHT;
        //var max = -100;
        var pivot = null;

        for(var i in weight_pivot){
            if( weight_pivot[i] > max){
                max = weight_pivot[i];
                pivot = i;
            }
        }

        //Check if same max weight is found for another pivot
        //If that so, then max pivot is null
        for(var i in weight_pivot){
            if( weight_pivot[i] == max && i != pivot){
                pivot = null;
            }
        }
        return {
            pivot: pivot,
            weight: max
        }
    }

    //get corresponding pivot for a key if exist and if association score if high enough
    get_pivot(domaine, key){
        if( !this.has_key(domaine, key)){
            console.warn("Key " + key + " for domain " + domaine + " does not exist.");
        }
        var pivot_weight = this.get_max_weight(domaine, key);

        console.log(JSON.stringify(pivot_weight));

        //Weight is not enough
        if(pivot_weight["weight"] < VALIDATED_ASSOCIATION_WEIGHT){
            return null;
        }
        return pivot_weight["pivot"];
    }

    has_domain(domaine){
        return this.website_key.hasOwnProperty(domaine);
    }

    has_key(domaine, key){
        if(!this.website_key.hasOwnProperty(domaine)){
            return false;
        }
        return this.website_key[domaine].hasOwnProperty(key);
    }

    //Create a new key for domain, with boostraping value
    //If key already exist, forbid action
    create_key(domaine, key, heuristic_ref){
        if(!this.has_domain(domaine)){
            console.warn("Create key: domain does not exist");
            return false;
        }

        if(this.has_key(domaine, key)){
            console.warn("Cannot create key: key already exist for domain");
            return false;
        }

        var new_key_content = {};
        var pivot = null; 
        for(var i in  liste_pivots){
            pivot = liste_pivots[i]; 
            //if no heuristic found, set all weight to 0
            if(heuristic_ref == null || heuristic_ref == "undefined"){
                new_key_content[pivot] = 0;
            }
            //Else set all weight to the one for heuristic detected
            else{
                if(pivot == heuristic_ref){
                    new_key_content[pivot] = HEURISTIC_BASE_WEIGHT;
                }else{
                    new_key_content[pivot] = -HEURISTIC_BASE_WEIGHT;
                }
            }
        }
        console.log("new key content : " + JSON.stringify(new_key_content, 4));
        this.website_key[domaine][key] = new_key_content;
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
    apply_pivot_on_key(domain, key, pivot_weight){
        var weights_website = this.website_key[domain][key];

        //Ensure weight are float
        for(var i in pivot_weight){
            pivot_weight[i] = string_to_float(pivot_weight[i]);
        }

        //list all pivots found from user value
        var pivots_user = Object.keys(pivot_weight);

        for(var pivot_user in pivot_weight){

            var old_weight = weights_website[pivot_user];

            //coeff represent multiplicatof for ajusting key pivot weight
            // 5 = want to validate association, 2 = want to increase association
            var coeff = 2;
            if(old_weight < VALIDATED_ASSOCIATION_WEIGHT){
                coeff = 5;
            }

            //Increase pivot found
            var new_weight = old_weight + coeff * pivot_weight[pivot_user];
            
            if(new_weight > MAX_KEY_PIVOT_WEIGHT){
                new_weight = MAX_KEY_PIVOT_WEIGHT;
            }
            //console.log("New weight = " + new_weight);
            weights_website[pivot_user] = new_weight;

            //Decrease others pivots, if not present for user value
            for(var pivot_website in weights_website){
                if( pivot_website == CODE_PIVOT_REFERENT ){
                    continue;
                }
                if(Object.keys(pivot_weight).includes(pivot_website)){
                    console.log("Don't modify " + pivot_website + " :  continue");
                    continue;
                }
                weights_website[pivot_website] = weights_website[pivot_website] - coeff * pivot_weight[pivot_user];

                if( weights_website[pivot_website] < MIN_KEY_PIVOT_WEIGHT )
                    weights_website[pivot_website] = MIN_KEY_PIVOT_WEIGHT;
            }
        }
        this.website_key[domain][key] = weights_website;
    }
}

var test_pivot_weight = {
    "first_name": "2.5",
    "family_name": "2"
}

var test_website_key = new WebsiteDb(exemple_domaine_key);
//console.log(test_website_key.get_max_weight("www.cdiscount.com", "prenom_txt"));
//console.log(test_website_key.website_key["www.cdiscount.com"]["prenom_txt"]);
test_website_key.apply_pivot_on_key("www.cdiscount.com", "prenom_txt", test_pivot_weight);
console.log(test_website_key.get_max_weight("www.cdiscount.com", "prenom_txt"));
console.log(test_website_key.website_key["www.cdiscount.com"]["prenom_txt"]);

test_website_key.create_key("www.cdiscount.com", "toto_txt", CODE_CVV_STRING);

console.log("toto_txt pivot ref: " + test_website_key.get_pivot("www.cdiscount.com", "toto_txt"));
console.log("toto_txt pivot ref: " + test_website_key.get_pivot("www.cdiscount.com", "prenom_txt"));
console.log("toto_txt pivot ref: " + test_website_key.get_pivot("www.cdiscount.com", "nom_fam_txt"));




