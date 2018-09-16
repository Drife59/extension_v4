import React, { Component } from 'react';

import { FooterContact } from './FooterContact';

export class Connected extends Component {

    render() {
        return(
            <section>
                <div id="main" class="col-8">
                    <br />
                    <br />

                    <img src="images/need_you.png" width="150" />
                    <br />
                    <br />
                    <p>You are connected as {this.props.getUser()}</p>
                </div>
                <FooterContact />
            </section>
        )
    }
}
