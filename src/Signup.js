import React, { Component } from 'react';

import { FooterPrevNext } from './FooterPrevNext';

export class Signup extends Component {

    constructor(props){
        super(props);
        this.state = {
            error_msg: "message erreur"
        }
        this.handleConnection = this.handleConnection.bind(this);
    }

    handleConnection(e){
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        var signup_error_msg = document.getElementById('signup_error_msg');

        //first hide old error message (if present)
        signup_error_msg.style.display = "none";

        //this is needed because we lose context in "fetch" callback
        var signup_component = this;

        if(email === "" || email === " "){
            signup_error_msg.style.display = 'block';
            signup_component.setState({
                error_msg: "Email cannot be empty"
            });
            return false;
        }

        if(password === "" || password === " "){
            signup_error_msg.style.display = 'block';
            signup_component.setState({
                error_msg: "Password cannot be empty"
            });
            return false;
        }

        var url = "http://localhost:1665/user/" + email + "/" + password;
        fetch(
            url, 
            {
                method: 'POST',
                mode: 'cors',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
            }
        )
        .then(function(response) {
            console.log("status: " + response.status + " type: " + typeof(response.status) )
            if (response.status === 200) {
                signup_component.props.setConnectedContent();             
            }else if (response.status === 409){
                signup_error_msg.style.display = 'block';
                signup_component.setState({
                    error_msg: "Your email already exist, try to log in."
                });
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
        return (
            <section id="main">
                <div class="row">
                    <div class="col-1"></div>
                    <div class="col-10">
                        <h1>Welcome !</h1>
                    </div>
                    <div class="col-1"></div>
                </div>

                <div id="login" class="container">
                        <div class="form col-12">
                            <p class="email">
                                <input required type="text" id="email" placeholder="Email address" />
                            </p>
                        </div>
                        <div class="form col-12">
                            <p class="password">
                                <input required type="password" id="password" placeholder="Create your password"/>
                            </p>
                        </div>
                </div>

                <div id="validation" class="container">
                    <div id="signup_error_msg" class="form col-12 error_msg">
                        <p> <img alt="careful" src="images/careful_icon.png" width="5%"/>  {this.state.error_msg} </p>
                    </div>
                    <div id="password_rules" class="form col-12 error_msg">
                        <p> <img alt="cross" src="images/cross_icon3.png" width="5%"/>  </p>
                        <p class="validation_msg"> <img alt="valid" src="images/valid_icon.png" width="5%"/>  Contain a number or a symbol. </p>
                    </div>
                </div>
                <FooterPrevNext back_action={this.props.setDisconnectedContent} next_action={this.handleConnection} />
            </section>
        );
    }
}
