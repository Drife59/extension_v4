/*
Projet Corail
Auteur: Benjamin GRASSART
Année: 2019

user_db.js

V6 functionnality.
Define graphical function for profil.

*/

//Define event to create lists on input to display profil
function init_event_list(){
    for (var i = 0; i < type_to_include.length; i++) {
        var inputs_type = inputs[type_to_include[i]];

        for (j = 0; j < inputs_type.length; j++) {

            var current_input = inputs_type[j];
            //Don't process search field
            if (is_search_field(current_input)) {
                continue;
            }

            //On hover, create and bind the list
            current_input.onmouseover = function(evt){
                evt.target.setAttribute("list", id_list);

                //Just put the list once
                if(evt.target.nextSibling.tagName != "DATALIST"){
                    evt.target.after(buildProfilList());
                }
            };

            //On mouse leave, delete the list and unbind it
            /*current_input.onmouseleave = function(evt){
                evt.target.removeAttribute("list");

                console.log("Type of next sibling: " + evt.target.nextSibling.tagName);
                //Just put the list once
                if(evt.target.nextSibling.tagName == "DATALIST"){
                    evt.target.nextSibling.remove();
                }
            };*/
        }
    }
}

//Build html to show a list (datalist HTML5)
/*
Example:
<datalist id="browsers">
  <option value="Internet Explorer">
  <option value="Firefox">
  <option value="Google Chrome">
</datalist>
*/
function buildProfilList(input_origin){
    var html_list = document.createElement('datalist');
    html_list.id = id_list;
    
    var opt = document.createElement('option');
    opt.value = profil_db.get_display_value_string(4);
    opt.profil_id = 4;

    opt.onmouseover = function(evt){
        console.log("Préaffichage du profil " + 4 + " : opt.value");
    }

    opt.onclick = function(evt){
        console.log("choix du profil " + 4 + " : opt.value");
        input_origin.value = "ma bite";
    }

    html_list.appendChild(opt);

    //If we leave the list, remove it
    html_list.onmouseleave = function(evt){
        alert("leave list");
        input_origin.removeAttribute("list");
        html_list.remove();
    }
    return html_list;
}