import React, { Component } from 'react';

import { FooterContact } from './FooterContact';

export class Connected extends Component {

    constructor(props){
        super(props);
        this.clearField = this.clearField.bind(this);
    }

    clearField(e){
        window.console.info("clear field");

        //alert(JSON.stringify(window.inputs, null, 4));
        window.clear_inputs();
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