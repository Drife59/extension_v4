/*
Projet Corail
Auteur: Benjamin GRASSART
Année: 2018

website_db.js

Define classes which are website db for front app.
CAREFUL: this library create user user value and update it.
It NEVER create pivot or manage it.
*/

/*
Define a object db to save website keys and associated weight for pivot
Object js to save data is as below: 
{
    <domaine1>: {
		<cle1>: {
			pivot_nom: coeff_correspondance,
			pivot_prenom: coeff_correspondance,
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
			"pivot_nom": 100,
			"pivot_prenom": 30,
			"pivot_age": 30,
            "pivot_date_naissance": -100,
            "pivot_jour_naissance": -100,
            "pivot_mois_naissance": -100,
            "pivot_annee_naissance": -100,
			"pivot_referent": "nom"
        },
        "prenom_txt": {
			"pivot_nom": 60,
			"pivot_prenom": 100,
			"pivot_age": 0,
            "pivot_date_naissance": -100,
            "pivot_jour_naissance": -100,
            "pivot_mois_naissance": -100,
            "pivot_annee_naissance": -100,
			"pivot_referent": "prenom"
        },
        "jour_naissance_txt": {
			"pivot_nom": 30,
			"pivot_prenom": 0,
			"pivot_age": 0,
            "pivot_date_naissance": 50,
            "pivot_jour_naissance": 100,
            "pivot_mois_naissance": 70,
            "pivot_annee_naissance": 0,
			"pivot_referent": "jour_naissance"
        },
        "mois_naissance_txt": {
			"pivot_nom": 30,
			"pivot_prenom": 0,
			"pivot_age": 70,
            "pivot_date_naissance": 70,
            "pivot_jour_naissance": 100,
            "pivot_mois_naissance": 100,
            "pivot_annee_naissance": 0,
			"pivot_referent": "mois_naissance"
        }
    },
    "www.rueducommerce.com": {
		"nom_fam_txt": {
			"pivot_nom": 100,
			"pivot_prenom": 30,
			"pivot_age": 30,
            "pivot_date_naissance": -100,
            "pivot_jour_naissance": -100,
            "pivot_mois_naissance": -100,
            "pivot_annee_naissance": -100,
			"pivot_referent": "nom"
        },
        "prenom_txt": {
			"pivot_nom": 60,
			"pivot_prenom": 100,
			"pivot_age": 0,
            "pivot_date_naissance": -100,
            "pivot_jour_naissance": -100,
            "pivot_mois_naissance": -100,
            "pivot_annee_naissance": -100,
			"pivot_referent": "prenom"
        }
    }
}
`


class WebsiteDb{
    constructor(domaine_key_text){
        this.website_key = JSON.parse(domaine_key_text);

        //Turn all string in int for weight
        for(var i in this.website_key ){
            console.log(i);
            for(var j in this.website_key[i] ){
                //console.log(this.website_key[i][j]);
                for(var k in this.website_key[i][j] ){
                    console.log(this.website_key[i][j][k]);
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


    get_max_weight(website_domain, key){
        var weight_pivot = this.website_key[website_domain][key];
        if (weight_pivot == undefined)
            return false;

        //var max = MIN_KEY_PIVOT_WEIGHT;
        var max = -100;
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
}

var test_website_key = new WebsiteDb(exemple_domaine_key);
console.log(test_website_key.get_max_weight("www.cdiscount.com", "prenom_txt"));
console.log(test_website_key.get_max_weight("www.cdiscount.com", "jour_naissance_txt"));
console.log(test_website_key.get_max_weight("www.cdiscount.com", "mois_naissance_txt"));





