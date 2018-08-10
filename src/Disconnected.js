import React, { Component } from 'react';

export class Disconnected extends Component {

    render() {
        console.log('Disconnected: I was triggered during render');
        return (
            <section id="main">
                <div id="login" class="container">
                    <div class="row">
                        <div class="col-1"></div>
                        <div class="col-10">
                            <h1>Autofill your informations online instantly ! {this.props.name} </h1>
                        </div>
                        <div class="col-1"></div>

                        <div class="col-12">
                            <a class="button signup" onClick={this.props.setSignupContent}>Sign up</a>
                            <br />
                            <p><u><a onClick={this.props.setSigninContent}>I already have an account.</a></u></p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
