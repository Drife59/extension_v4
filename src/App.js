 /* global chrome */

import React, { Component } from 'react';
import './App.css';

import { Disconnected } from './Disconnected';
import { Signup } from './Signup';
import { Welcome } from './Welcome';
import { Signin } from './Signin';
import { Connected } from './Connected';
import { Header } from './Header';

import { config } from './config';


class App extends Component {
    
    constructor(props){
        super(props);

        this.state = {
            central_content: Disconnected,
            displayLogout: false,
            display_footer: false
        }

        //These bind are needed to execute function from child component
        this.setContent   = this.setContent.bind(this);
        this.setDisconnectedContent = this.setDisconnectedContent.bind(this);
        this.setSignupContent       = this.setSignupContent.bind(this);
        this.setWelcomeContent      = this.setWelcomeContent.bind(this);
        this.setSigninContent       = this.setSigninContent.bind(this);
        this.setConnectedContent    = this.setConnectedContent.bind(this);
        this.setUser                = this.setUser.bind(this);
        this.getUser                = this.getUser.bind(this);
        this.logout                 = this.logout.bind(this);

        // Initialise communication listenner
        // We need to listen to Legacy App, to react from its events
        chrome.runtime.onMessage.addListener(
            function(request, sender, sendResponse) {
                console.debug(sender.tab ?
                    "Got request from tab :" + sender.tab.url :
                    "from the extension");
            
                //If we get a "get profil" request and profil db is not properly instantiated, reload it
                if (request.action === config.NOTIFICATION_ADD_VALUE_PROFIL){
                    console.info("Received message with action: " + config.NOTIFICATION_ADD_VALUE_PROFIL);
                    console.info("Launching notfication on user value added");
                    sendResponse({
                        "code": config.CODE_RECEPTION_OK
                    });
                }
        });
    }

    /* Functions below set content except Header*/

    setContent(app_content, displayLogout){
        this.setState({
            central_content: app_content,
            displayLogout: displayLogout
        });
    }

    setDisconnectedContent(){
        this.setContent(Disconnected, false);
    }

    setSignupContent(){
        this.setContent(Signup, false);
    }

    setWelcomeContent(){
        this.setContent(Welcome, false);
    }

    setSigninContent(){
        this.setContent(Signin, false);
    }

    setConnectedContent(){
        this.setContent(Connected, true);
    }

    setUser(email, password){
        this.setState({
            "current_user": email,
        });

        var obj_to_save = {
            "email": email,
            "password": password
        }
        
        chrome.storage.sync.set({"current_user": obj_to_save}, function() {
            console.debug('[setUser] Storage sync: current user => ' + email);
        });

        console.info("[setUser] Setting user: " + email + " / " + password);

        var str_code = "set_user_psd_content_script(\"" + email + "\", \"" + password + "\" )";

        console.debug("Executing following code in content script: " + str_code);

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.executeScript(tabs[0].id, {
                code: str_code
            }, 
            function(response) {
            
            });
        });
    }

    getUser(){
        return this.state.current_user;
    }

    getDisplayLogout(){
        try{
            var res = this.state.displayLogout;
            return res;
        }
        catch(error){
            console.warn("Could not find DisplayLogout in parent state");
            //By default, don't display logout button
            return false;
        }
    }

    componentDidMount() {
        var app = this;

        //By default, don't display logout sign
        this.setState({
            displayLogout: false
        });

        //Get user from storage and set it in State
        chrome.storage.sync.get('current_user', function(result) {
            if(result.current_user !== null && result.current_user !== undefined){
                console.info('[componentDidMount] From cache current user is ' + result.current_user.email);
                console.info('[componentDidMount] From cache current password is ' + result.current_user.password);

                app.setUser(result.current_user.email, result.current_user.password);
                app.setConnectedContent();
            }
        });

        
    }

    logout() {
        this.setState({ current_user: undefined });

        chrome.storage.sync.clear(); 
        console.info("[logout] Clear cache from chrome storage");
        this.setDisconnectedContent();
    }

    render() {
        const Tag = this.state.central_content;
        return (
            <div className="App">
                <Header logout = {this.logout} displayLogout = {this.getDisplayLogout()}/>

                <Tag 
                    setSignupContent       = {this.setSignupContent}
                    setWelcomeContent      = {this.setWelcomeContent}  
                    setSigninContent       = {this.setSigninContent} 
                    setDisconnectedContent = {this.setDisconnectedContent}
                    setConnectedContent    = {this.setConnectedContent}
                    setUser                = {this.setUser}
                    getUser                = {this.getUser}
                />

                <script src="http://code.jquery.com/ui/1.9.2/jquery-ui.js"></script>
                <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
            </div>
        );
    }
}

export default App;
