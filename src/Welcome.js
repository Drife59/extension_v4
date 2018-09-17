 /* global chrome */

import React, { Component } from 'react';

import { FooterSkip } from './FooterSkip';

export class Welcome extends Component {

    handleDemo(e){
        var newURL = "https://www.corail.me";
        chrome.tabs.create({ url: newURL });

        this.props.setConnectedContent();
    }
    
    render() {
        return (
            <section id="main">
                <div class="row">
                    <div class="col-1"></div>
                    <div class="col-10">
                        <h1>Welcome !</h1>
                    </div>
                    <div class="col-1"></div>
                    <div class="col-12 ">
                        <h5> Try the demo to understand how it works. </h5>
                    </div>
                </div>


                <div id="login" class="container">
                    <div class="row">
                        <div class="col-12">
                            <a id="demo" href="#" onClick={this.handleDemo} class="button special">Go !</a>
                        </div>
                    </div>
                </div>
                <FooterSkip action={this.props.setConnectedContent}/>
            </section>
        );
    }
}
