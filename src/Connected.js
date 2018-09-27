import React, { Component } from 'react';

import { FooterContact } from './FooterContact';

export class Connected extends Component {

    render() {
        return(
            <section>
                <div id="main" class="col-12">
                    <div id="voice">
                        <br />
                        <br />

                        <img src="images/need_you.png" />
                        <br />
                        <br />
                    </div>    
                    <p> Hey {this.props.getUser()}, we need you ! </p>
                </div>
                <FooterContact />
            </section>
        )
    }
}