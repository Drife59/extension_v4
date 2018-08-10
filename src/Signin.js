import React, { Component } from 'react';

import { FooterPrevNext } from './FooterPrevNext';

export class Signin extends Component {
    render() {
        return(
        <section id="main">
            <div class="row">
                <div class="col-1"></div>
                <div class="col-10">
                    <h1>Welcome back !</h1>
                </div>
                <div class="col-1"></div>
            </div>


            <div id="login" class="container">
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
                        <p><u><a >I forgot my password.</a></u></p>
                    </div>
            </div>
            
            <div id="validation" class="container">
                    <div id="wrong_email" class="form col-12">
                        <p class="error_msg"> <img alt="careful" src="images/careful_icon.png" width="5%"/>  This email doesn't exist. </p>
                    </div>
                    <div id="wrong_password" class="form col-12">
                        <p class="error_msg"> <img alt="careful" src="images/careful_icon.png" width="5%"/>  Your password is incorrect. </p>
                    </div>
                    <br />
            </div>
            <FooterPrevNext back_action={this.props.setDisconnectedContent} next_action={null} />
        </section>
        )
    }
}
