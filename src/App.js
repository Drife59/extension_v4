 /* global chrome */

import React, { Component } from 'react';
import './App.css';

import { Disconnected } from './Disconnected';
import { Signup } from './Signup';
import { Signin } from './Signin';
import { Connected } from './Connected';


class App extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            central_content: Disconnected,
            display_footer: false
        }

        //These bind are needed to execute function from child component
        this.setContent   = this.setContent.bind(this);
        this.setDisconnectedContent = this.setDisconnectedContent.bind(this);
        this.setSignupContent       = this.setSignupContent.bind(this);
        this.setSigninContent       = this.setSigninContent.bind(this);
        this.setConnectedContent    = this.setConnectedContent.bind(this);

    }

    /* Functions below set content except Header*/

    setContent(app_content){
        this.setState({
            central_content: app_content,
        });
    }

    setDisconnectedContent(){
        this.setContent(Disconnected);
    }

    setSignupContent(){
        this.setContent(Signup);
    }

    setSigninContent(){
        this.setContent(Signin);
    }

    setConnectedContent(){
        this.setContent(Connected);
    }

    setUser(email){
        console.log("Setting email");
        chrome.storage.sync.set({user: email}, function() {
            console.log('Value is set to ' + email);
        });
    }

    render() {
        const Tag = this.state.central_content;

        return (
            <div className="App">
                <header id="header">
                    <div class="container">
                        <div class="row">
                            <div class="col-12">
                                <img alt="logo" src="images/logo_corail.png" width="100" />
                            </div>
                        </div>
                    </div>
                </header>

                <Tag 
                    setSignupContent       = {this.setSignupContent} 
                    setSigninContent       = {this.setSigninContent} 
                    setDisconnectedContent = {this.setDisconnectedContent}
                    setConnectedContent    = {this.setConnectedContent}
                    setUser                = {this.setUser}
                />

                <script src="http://code.jquery.com/ui/1.9.2/jquery-ui.js"></script>
                <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
            </div>
        );
    }
}

export default App;
