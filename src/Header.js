/*global chrome*/

import React, { Component } from 'react';

export class Header extends Component {

    constructor(props){
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogout(e){
        
        //Save the weight modification on profil user
        //These modification has been save in cache previously
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.executeScript(tabs[0].id, {
                code: "profil_db.update_all_weight_in_back();"
            }, 
            function(response) {
            
            });
        });

        //Don't clear storage too fast, we want to send profil weight to back-end
        setTimeout(function () {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.executeScript(tabs[0].id, {
                    code: "chrome.storage.sync.clear(); console.info(\"[Logout] Cleared all cache.\"); unbind_inputs(); profil_id_chosen=null;"
                },
                function(response) {
            
                });
            });
        }, 100);
        this.props.logout();
    }

    componentDidUpdate(){
        var displayLogout = this.props.displayLogout;
        
        console.log("componentDidUpdate, props.displayLogout: " + displayLogout);

        if(displayLogout === false){
            document.getElementById("menu").style.display = "none";
        }

        if(displayLogout === true){
            document.getElementById("menu").style.display = "block";
        }
    }

    render() {
        return(
            <header id="header">
                <div class="container">
                    <div class="row">
                        <div class="col-2"></div>
                        <div class="col-8">
                            <img alt="logo corail" src="images/banner_corail.png" width="100" />
                        </div>
                        <div id="menu" class="col-2">
                            <div id="logout">
                                <a onClick={this.handleLogout}>
                                    <img alt="switch" src="images/switch.png"/>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        );
    }
}