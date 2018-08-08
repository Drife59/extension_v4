import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { Disconnected } from './Disconnected';

//String correspond to the name of the class to manage
const DISCONNECTED_STATE = "Disconnected";
const SIGNUP_STATE = "Signup";
const SIGNIN_STATE = "Signin";

class App extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            central_content: Disconnected
        }
    }

    setAppCentralContent(app_content){
        this.setState({
            central_content: app_content
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
                                <img src="images/logo_corail.png" width="100" />
                            </div>
                        </div>
                    </div>
                </header>

                <Tag />

                <script src="http://code.jquery.com/ui/1.9.2/jquery-ui.js"></script>
                <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
            </div>
        );
    }
}

export default App;
