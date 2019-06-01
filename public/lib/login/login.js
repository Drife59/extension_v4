/*
Projet Corail
Auteur: Benjamin GRASSART
Année: 2019

login.js

V7 functionnality.
Define object to manage user profil
*/



/*
The content of an object Profil would be as the following:
{
    website_id: 3,
    domain: "www.cdiscount.com",
    login_psd:[
        { login_id: 2, login: bjbtiben@hotmail.fr, password: "coucou59" },
        ...
        { login_id: 372, login: benjamin.grassart@outlook.fr, password: "tata70"}
    ]
}

As you can notice, the content must change for each domain change.

*/ 
class LoginPsd {
    constructor(website_id, domain, login_psd) {
        this.website_id = website_id;
        this.domain = domain;
        this.login_psd = [];

        if(login_psd !== undefined && login_psd !== "undefined"){
            this.login_psd = login_psd;
        }
        console.debug("Created LoginPsd for domain " + this.domain +
            "DB with values: " + JSON.stringify(this.login_psd, null, 4));        
    }

    //Build the content of the object login within the API return from back-end
    /*
    The back response is as follow:
    [
        {
            "loginId": 2,
            "login": "bjbtiben@hotmail.fr",
            "password": "coucou59",
            "user": {
                "userId": 1,
                "email": "bjbtiben@hotmail.fr",
                "password_hash": "a6c97f751ee4b2dc38032bf0057c748865a0f49fb4d18184fdf2e39455b566ec",
                "created_at": "2019-03-12T12:01:50.3979819",
                "updated_at": "2019-03-12T12:01:50.3980874"
            },
            "website": {
                "websiteId": 443,
                "domaine": "slite.com",
                "created_at": "2019-04-12T13:34:17.1099091",
                "updated_at": "2019-04-12T13:34:17.1099168"
            },
            "created_at": "2019-05-23T10:21:09.3267107",
            "updated_at": "2019-05-23T10:21:09.326771"
        },
    ...
    ]*/
    build_login_from_back(json_login){

        if(json_login.length < 1){
            console.warn("[build_login_from_back]The json provided has a length zero, aborting.");
            return false;
        }
        
        console.debug("Starting building login profile...");
        console.debug("Raw login object from back: " + JSON.stringify(json_login, null, 4));

        //First, get website informations and init it in object
        this.website_id = json_login[0]["website"]["websiteId"];
        this.domain     = json_login[0]["website"]["domaine"];

        this.login_psd = [];

        for(var i = 0 ; i < json_login.length ; i++){
            var current_login = json_login[i];
            var new_login = {};
            new_login["loginId"] = current_login["loginId"];
            new_login["login"] = current_login["login"];
            new_login["password"] = current_login["password"];
            this.login_psd.push(new_login);
        }

        console.info("[build_login_from_back] LoginPsd object was initialited with the following content: ");
        console.info("Website id: " + this.website_id);
        console.info("Website domain: " + this.domain);
        console.info("Login / psd obj: " + JSON.stringify(this.login_psd, null, 4));
    }

    //Have we at least one login for current form
    has_login(){
        if(this.login_psd.length > 0){
            return true;
        }
        console.info("[LoginPsd] No login for domain: " + this.domain);
        return false;
    }

    //Have we one and only one login for this website ?
    has_only_one_login(){
        if(this.login_psd.length == 1){
            return true;
        }
        return false;
    }

    //return login for website if there is only one
    get_only_login(){
        if( !this.has_login() ){
            console.warn("[get_only_login] Cannot return solo login, no login at all");
            return false;
        }

        if( !this.has_only_one_login() ){
            console.warn("[get_only_login] Cannot return solo login, multiple login present");
            return false;
        }

        return this.login_psd[0];
    }
}
