/*global chrome*/

import React, { Component } from 'react';

import { FooterPrevNext } from './FooterPrevNext';

import { config } from './config';

export class Signin extends Component {

    constructor(props){
        super(props);
        this.handleConnection = this.handleConnection.bind(this);
    }

    handleConnection(e){

        //When a new sign start, clear cache in case some old cache remain
        //Should never happened, but I noticed sometimes it does
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.executeScript(tabs[0].id, {
                code: "chrome.storage.sync.clear(); console.info(\"[Logout] Cleared all cache.\"); profil_id_chosen=null;"
            },
            function(response) {
        
            });
        });

        chrome.storage.sync.clear();
        console.info("Clear all cache from React js app");


        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        var msg_wrong_email = document.getElementById('wrong_email');
        var msg_wrong_password = document.getElementById('wrong_password');

        //first hide old error message (if present)
        msg_wrong_email.style.display = "none";
        msg_wrong_password.style.display = "none";

        if(email === "" || email === " "){
            msg_wrong_email.style.display = 'block';
            return false;
        }

        if(password === "" || password === " "){
            msg_wrong_password.style.display = 'block';
            return false;
        }

        //this is needed because we lose context in "fetch" callback
        var signin_component = this;

        var url = config.endpoint_back + "/user/" + email + "/" + password;
        fetch(
            url, 
            {
                method: 'GET',
                mode: 'cors',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
            }
        )
        .then(function(response) {
            console.info("status: " + response.status + " type: " + typeof(response.status) )
            if (response.status === 200) {
                signin_component.props.setConnectedContent();
                signin_component.props.setUser(email, password);
                
                //Initialising legacy code
                var user = signin_component.props.getUser();

                //Build code to initialise all front db
                var str_code = "load_user_db_from_back(\"" + user + "\", true);" + 
                               "load_profils_from_back(\"" + user + "\", true);" +
                               "load_website_db_from_back(true);" + 
                               "init_fields();";

                str_code += 'setTimeout(function () { init_event_list_profil(); }, (timeout_parsing + 500))';
                
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    chrome.tabs.executeScript(tabs[0].id, {
                        code: str_code
                    }, 
                    function(response) {
                    
                    });
                });
            }else if (response.status === 404){
                msg_wrong_email.style.display = 'block';
            }else if (response.status === 403){
                msg_wrong_password.style.display = 'block';
            }

            return response;
        }).catch(function(error) {
            //Unexpected error, from network connection for example
            console.log(error);
        });
    }

    handleKeyPress = (event) => {
        if(event.key === 'Enter'){
            this.handleConnection(event);
        }
    }
    render() {
        var mail_body = "Hello Corail ! I forgot my password, can you send me back my password as soon as possible. Thank you.";
        var subject = "Password forgotten";
        var mailto = "mailto:contact@corail.me?subject=" + subject + "?body=" + mail_body;
        return(
        <section id="main">
            <div class="row">
                <div class="col-1"></div>
                <div class="col-10">
                    <h1>Welcome back !</h1>
                </div>
                <div class="col-1"></div>
            </div>

            <div id="login" class="container" onKeyPress={this.handleKeyPress}>
                    <div class="form col-12">
                        <p class="email">
                            <input required type="text" id="email" placeholder="Your email address"/>
                        </p>
                    </div>
                    <div class="form col-12">
                        <p class="password">
                            <input required type="password" id="password" placeholder="Your password"/>
                        </p>
                    </div>
                    <div class="col-12">
                        <p><u><a href={mailto}>I forgot my password.</a></u></p>
                    </div>
            </div>
            
            <div id="validation" class="container">
                    <div id="wrong_email" class="form col-12 error_msg">
                        <p> <img alt="careful" src="images/careful_icon.png" width="5%"/>  This email doesn't exist. </p>
                    </div>
                    <div id="wrong_password" class="form col-12 error_msg">
                        <p> <img alt="careful" src="images/careful_icon.png" width="5%"/>  Your password is incorrect. </p>
                    </div>
                    <br />
            </div>
            <FooterPrevNext back_action={this.props.setDisconnectedContent} next_action={this.handleConnection} />
        </section>
        )
    }
}
