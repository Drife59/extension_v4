 /* global chrome */

import React, { Component } from 'react';
import './App.css';

import { Disconnected } from './Disconnected';
import { Signup } from './Signup';
import { Signin } from './Signin';
import { Connected } from './Connected';
import { Header } from './Header';


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
        this.setSigninContent       = this.setSigninContent.bind(this);
        this.setConnectedContent    = this.setConnectedContent.bind(this);
        this.setUser                = this.setUser.bind(this);
        this.getUser                = this.getUser.bind(this);
        this.logout                 = this.logout.bind(this);
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

    setSigninContent(){
        this.setContent(Signin, false);
    }

    setConnectedContent(){
        this.setContent(Connected, true);
    }

    setUser(email){
        this.setState({
            current_user: email,
        });
        
        chrome.storage.sync.set({current_user: email}, function() {
            console.log('Storage sync: current user => ' + email);
        });
    }

    getUser(){
        console.log("getting email...");
        return this.state.current_user;
    }

    getDisplayLogout(){
        try{
            var res = this.state.displayLogout;
            console.log("found getDisplayLogout()");
            return res;
        }
        catch(error){
            console.log("Could not find DisplayLogout in parent state");
            //By default, don't display logout button
            return false;
        }
    }

    componentDidMount() {
        var app = this;

        //Get user from storage and set it in State
        chrome.storage.sync.get('current_user', function(result) {
            console.log('Current user is ' + result.current_user);
            if(result.current_user !== null && result.current_user !== undefined){
                app.setUser(result.current_user);
                console.log("Set connected content");
                app.setConnectedContent();
            }
        });
    }

    logout() {
        this.setState({ current_user: undefined });
        console.log("Set email as undefined in state");

        chrome.storage.sync.remove('current_user', function(result){
            console.log("Removed current user from chrome storage");
        });
        this.setDisconnectedContent();
    }

    render() {
        const Tag = this.state.central_content;
        return (
            <div className="App">
                <Header logout = {this.logout} displayLogout = {this.getDisplayLogout()}/>

                <Tag 
                    setSignupContent       = {this.setSignupContent} 
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
