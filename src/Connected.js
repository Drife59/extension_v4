import React, { Component } from 'react';

import { FooterContact } from './FooterContact';

export class Connected extends Component {
    render() {
        return(
            <section>
                <div id="main" class="col-8">
                    <br />
                    <br />
                    <br />
                    <h1> Autofill </h1>

                    <div id="toggle" class="material-switch pull-right">
                        <input id="autofill_optin" name="sautofill_optin" type="checkbox" checked />
                        <label for="autofill_optin" class="label-success"></label>
                    </div>

                    <p>You are connected as {this.props.getUser}</p>
                </div>
                <FooterContact />
            </section>
        )
    }
}
