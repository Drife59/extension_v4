import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { Disconnected } from './Disconnected';
import { Signup } from './Signup';
import { Signin } from './Signin';
import { footerPrevNext } from './FooterPrevNext';


class App extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            central_content: Disconnected
        }

        //These bind are needed to execute function from child component
        this.setAppCentralContent   = this.setAppCentralContent.bind(this);
        this.setDisconnectedContent = this.setDisconnectedContent.bind(this);
        this.setSignupContent       = this.setSignupContent.bind(this);
        this.setSigninContent       = this.setSigninContent.bind(this);

    }

    /* Functions below set central content */

    setAppCentralContent(app_content){
        this.setState({
            central_content: app_content
        });
    }

    setDisconnectedContent(){
        console.log("Set disconnected content");
        this.setAppCentralContent(Disconnected);
    }

    setSignupContent(){
        console.log("Set Signup content");
        this.setState({ central_content: Signup });
    }

    setSigninContent(){
        console.log("Set sign in content");
        this.setAppCentralContent(Signin);
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

                <Tag setSignupContent={this.setSignupContent} setSigninContent={this.setSigninContent}/>

                <script src="http://code.jquery.com/ui/1.9.2/jquery-ui.js"></script>
                <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
            </div>
        );
    }
}

export default App;
