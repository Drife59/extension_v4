/*global chrome*/

import React, { Component } from 'react';

import { FooterContact } from './FooterContact';

export class Connected extends Component {

    constructor(props){
        super(props);
        this.clearField = this.clearField.bind(this);
    }

    //Implement reset field, possibly filled by Corail
    //Call a "Legacy" function, in external web page context
    clearField(e){
        console.info("clear field");

        //Huuuuu this is quite ugly. Don't know how to improve it
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.executeScript(tabs[0].id, {
                code: "clear_inputs();"
            }, 
            function(response) {
            
            });
        });
    }

    render() {
        return(
            <section>
                <div id="main" class="col-12">
                    <div id="voice">
                        <img alt="img_connected" id="img_connected" src="images/need_you.png" />
                    </div>
                    <button onClick={this.clearField}> clear </button>    
                    <p> Hey {this.props.getUser()}, we need you ! </p>
                </div>
                <FooterContact />
            </section>
        )
    }
}