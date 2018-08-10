import React, { Component } from 'react';

export class FooterContact extends Component {

    render() {
        return(
            <footer id="footer">
                <div class="container">
                    <div class="row">
                        <div class="col-12">
                            <p>We need you. Give us some feedback. 
                                <a id="emailLnk" href="mailto:contact@corail.me?subject=My Feedback">
                                <img src="images/email.png" width="5%"/> 
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }
}
