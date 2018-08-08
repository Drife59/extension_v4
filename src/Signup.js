import React, { Component } from 'react';

export class Signup extends Component {
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
                    <div id="wrong_email" class="form col-12">
                        <p> <img src="images/careful_icon.png" width="5%"/>  Your email already exists. </p>
                    </div>
                    <div id="password_rules" class="form col-12">
                        <p> <img src="images/cross_icon3.png" width="5%"/>  Your email must be valid. </p>
                        <p> <img src="images/cross_icon3.png" width="5%"/>  At least 8 characters. </p>
                        <p> <img src="images/valid_icon.png" width="5%"/>  Contain a number or a symbol. </p>
                    </div>
                </div>
            </section>
        );
    }
}
