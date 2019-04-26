/*global chrome*/

import React, { Component } from 'react';

import { FooterContact } from './FooterContact';

import { config } from './config';

export class Connected extends Component {

    constructor(props){
        super(props);
        this.openProfil = this.openProfil.bind(this);

    }

    openProfil(e){
        chrome.tabs.create({'url': chrome.extension.getURL(config.url_create_profil)}, function(tab) {
            // Tab opened.
        });
    }

    render() {
        return(
            <section id="main">
                <div id="connected" class="container">
                    <div class="row">
                        <div class="col-1"></div>
                        <div class="col-10">
                            <a class="button signup" onClick={this.openProfil}> Create profil </a>
                        </div>
                        <div class="col-1"></div>

                        <div class="col-12">
                            <p> Hey {this.props.getUser()}, we need you ! </p>
                        </div>
                    </div>
                </div>
                <FooterContact />
            </section>
        )
    }
}