import React, { Component } from 'react';

import { FooterContact } from './FooterContact';

export class Connected extends Component {

    constructor(props){
        super(props);
        //this.handleConnection = this.handleConnection.bind(this);
    }

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
                </div>
                <FooterContact />
            </section>
        )
    }
}
