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
    /*object_result["first_name"] = 0;
    object_result["family_name"] = 0;
    object_result["postal_code"] = 0;
    object_result["home_city"] = 0;
    object_result["cellphone_number"] = 0;
    object_result["main_email"] = 0;
    object_result["main_full_address"] = 0;
    object_result["day_of_birth"] = 0;
    object_result["month_of_birth"] = 0;
    object_result["year_of_birth"] = 0;
    object_result["company"] = 0;
    object_result["homephone"] = 0;
    object_result["cvv"] = 0;
    object_result["cardexpirymonth"] = 0;
    object_result["cardexpiryyear"] = 0;
    object_result["full_birthdate"] = 0;
    object_result["country"] = 0;*/

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


function compare2Objects(x, y) {
    var p;

    // remember that NaN === NaN returns false
    // and isNaN(undefined) returns true
    if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
        return true;
    }

    // Compare primitives and functions.     
    // Check if both arguments link to the same object.
    // Especially useful on the step where we compare prototypes
    if (x === y) {
        return true;
    }

    // Works in case when functions are created in constructor.
    // Comparing dates is a common scenario. Another built-ins?
    // We can even handle functions passed across iframes
    if ((typeof x === 'function' && typeof y === 'function') ||
        (x instanceof Date && y instanceof Date) ||
        (x instanceof RegExp && y instanceof RegExp) ||
        (x instanceof String && y instanceof String) ||
        (x instanceof Number && y instanceof Number)) {
        return x.toString() === y.toString();
    }

    // At last checking prototypes as good as we can
    if (!(x instanceof Object && y instanceof Object)) {
        return false;
    }

    if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
        return false;
    }

    if (x.constructor !== y.constructor) {
        return false;
    }

    if (x.prototype !== y.prototype) {
        return false;
    }

    // Check for infinitive linking loops
    if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
        return false;
    }

    // Quick checking of one object being a subset of another.
    // todo: cache the structure of arguments[0] for performance
    for (p in y) {
        if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
            return false;
        }
        else if (typeof y[p] !== typeof x[p]) {
            return false;
        }
    }

    for (p in x) {
        if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
            return false;
        }
        else if (typeof y[p] !== typeof x[p]) {
            return false;
        }

        switch (typeof (x[p])) {
            case 'object':
            case 'function':

                leftChain.push(x);
                rightChain.push(y);

                if (!compare2Objects(x[p], y[p])) {
                    return false;
                }

                leftChain.pop();
                rightChain.pop();
                break;

            default:
                if (x[p] !== y[p]) {
                    return false;
                }
                break;
        }
    }

    return true;
}