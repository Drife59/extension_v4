/*global chrome*/

import React, { Component } from 'react';

import { FooterContact } from './FooterContact';

export class Connected extends Component {

    constructor(props){
        super(props);
    }

    render() {
        return(
            <section>
                <div id="main" class="col-12">
                    <div id="voice">
                        <img alt="img_connected" id="img_connected" src="images/need_you.png" />
                    </div>
                    <p> Hey {this.props.getUser()}, we need you ! </p>
                </div>
                <FooterContact />
            </section>
        )
    }
}