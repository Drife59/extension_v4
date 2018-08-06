import React, { Component } from 'react';

export class Disconnected extends Component {
    render() {
        return (
            <section id="main">
                <div id="login" class="container">
                    <div class="row">
                        <div class="col-1"></div>
                        <div class="col-10">
                            <h1>Autofill your informations online instantly !</h1>
                        </div>
                        <div class="col-1"></div>

                        <div class="col-12">
                            <a href="signup1.html" class="button signup">Sign up</a>
                            <br />
                            <p><u><a>I already have an account.</a></u></p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
