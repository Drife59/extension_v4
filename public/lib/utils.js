/*
Projet Corail
Auteur: Benjamin GRASSART
Année: 2019

utils.js

Défini des fonctions utilitaires transversales.
Ce fichier est à importer avant toute fonctionnalitée.
Cf config manifest.json
*/

//Remplace tout les "." et les "$" par des underscores
function securise_cle(cle) {
    return cle.replace(/\./g, '_').replace(/\$/g, '_');
}

//Construit une clé (stockage BDD) pour un domaine, id + name + type
function construit_domaine_cle(html_elt) {
    if (html_elt.tagName == "INPUT") {
        return securise_cle(html_elt.id + separateur_cle + html_elt.name + separateur_cle + html_elt.type);
    } else if (html_elt.tagName == "SELECT") {
        return securise_cle(html_elt.id + separateur_cle + html_elt.name + separateur_cle + "select");
    }
}

//Génère un uuid compatible RFC4122
function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}


//Return number from string as float
function string_to_float(string_number) {
    if (typeof string_number === 'string' || string_number instanceof String) {
        return parseFloat(string_number.replace(",", "."));
    }
    //not a string, return it as it is
    return string_number;
}


/*Return a squeletton for requesting api back on keys.
Only code key is provided, to identify key.
All weight are set to zero and should be updated in main code.*/
function createEmptyKeyRequestObject(code_key) {
    var object_result = {};
    object_result["cle"] = code_key;

    for (var i = 0; i < liste_pivots.length; i++) {
        object_result[liste_pivots[i]] = 0;
    }
    object_result["pivot_reference"] = null;
    return object_result;
}

//Create a copy based on JSON functionnality
function jsonCopy(src) {
    return JSON.parse(JSON.stringify(src));
}


//Personnalize String object to add a function to capitalize String
String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}

//Mark heuristic as used if a field is filled
//by first or second algoritm (beforce dedicated heuristic algoritm)
function mark_heuristic_used(input, key_domain) {
    var weight_heuristic = set_weight_heuristic(input);
    var absolute_top_weigth = find_absolute_top_weigth(weight_heuristic);
    var corresponding_heuristic = get_heuristic_to_use(input, key_domain, weight_heuristic, absolute_top_weigth);

    if (heurisitic_code_error_list.includes(corresponding_heuristic) == false) {
        console.debug("Mark " + key_domain + " as already filled.");
        heuristic_activated[corresponding_heuristic] = true;
    }
}

//https://www.kirupa.com/html5/get_element_position_using_javascript.htm
//Return absolute position in pixel of an element
function getPosition(el) {
    var xPos = 0;
    var yPos = 0;

    while (el) {
        if (el.tagName == "BODY") {
            // deal with browser quirks with body/window/document and page scroll
            var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
            var yScroll = el.scrollTop || document.documentElement.scrollTop;

            xPos += (el.offsetLeft - xScroll + el.clientLeft);
            yPos += (el.offsetTop - yScroll + el.clientTop);
        } else {
            // for all other non-BODY elements
            xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
            yPos += (el.offsetTop - el.scrollTop + el.clientTop);
        }

        el = el.offsetParent;
    }
    return {
        x: xPos,
        y: yPos
    };
}

//Return the number of occurrence of the substring in string
function occurrences_in_string(string, subString, allowOverlapping) {

    string += "";
    subString += "";
    if (subString.length <= 0) return (string.length + 1);

    var n = 0,
        pos = 0,
        step = allowOverlapping ? 1 : subString.length;

    while (true) {
        pos = string.indexOf(subString, pos);
        if (pos >= 0) {
            ++n;
            pos += step;
        } else break;
    }
    return n;
}

// Set in storage and RAM the user and it's password
function set_user_psd_content_script(user, password) {
    console.info("[set_user_psd_content_script]: Setting user " + user + " for content scripts");
    console.info("[set_user_psd_content_script]: Setting password " + password + " for content scripts");

    current_user = user;
    current_psd = password;

    var obj_to_save = {
        "email": user,
        "password": password
    }

    chrome.storage.sync.set({ current_user: obj_to_save }, function () {
        console.log('[set_user_psd_content_script]: Google storage sync: current user => ' + user);
    });
}

function isEqual (value, other) {

	// Get the value type
	var type = Object.prototype.toString.call(value);

	// If the two objects are not the same type, return false
	if (type !== Object.prototype.toString.call(other)) return false;

	// If items are not an object or array, return false
	if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false;

	// Compare the length of the length of the two items
	var valueLen = type === '[object Array]' ? value.length : Object.keys(value).length;
	var otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;
	if (valueLen !== otherLen) return false;

	// Compare two items
	var compare = function (item1, item2) {

		// Get the object type
		var itemType = Object.prototype.toString.call(item1);

		// If an object or array, compare recursively
		if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
			if (!isEqual(item1, item2)) return false;
		}

		// Otherwise, do a simple comparison
		else {

			// If the two items are not the same type, return false
			if (itemType !== Object.prototype.toString.call(item2)) return false;

			// Else if it's a function, convert to a string and compare
			// Otherwise, just compare
			if (itemType === '[object Function]') {
				if (item1.toString() !== item2.toString()) return false;
			} else {
				if (item1 !== item2) return false;
			}

		}
	};

	// Compare properties
	if (type === '[object Array]') {
		for (var i = 0; i < valueLen; i++) {
			if (compare(value[i], other[i]) === false) return false;
		}
	} else {
		for (var key in value) {
			if (value.hasOwnProperty(key)) {
				if (compare(value[key], other[key]) === false) return false;
			}
		}
	}

	// If nothing failed, return true
	return true;

};


// Return the solo name of the domain, "boulanger", "rueducommerce"
// from a domain like "corail.me" or "www.corail.me"
function get_domain_from_host(domain){
    var domain_to_do = domain;
    if(domain == undefined){
        domain_to_do = window.location.host;
    }
    words = domain_to_do.split(".");

    console.info("Words: " + words.length);
    console.info(JSON.stringify(words, null, 4));

    if(words.length < 2 || words.length > 3){
        console.warn("[get_domain_from_host] Cannot get domain from host " + domain_to_do);
        return words[0];
    }

    //It's probably like "corail.me" or "boulanger.com"
    if(words.length = 2){
        return words[0];
    }

    //It's probably like www.outlook.fr
    if(words.length = 3){
        return words[1];
    }

    //This should never happen
    console.warn("[get_domain_from_host] Cannot get domain from host " + domain_to_do);
    return false;
}

console.info("\n\n Get domain from host: " + get_domain_from_host());