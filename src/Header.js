import React, { Component } from 'react';

export class Header extends Component {

    constructor(props){
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogout(e){
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
                            <img alt="logo corail" src="images/logo_corail.png" width="100" />
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