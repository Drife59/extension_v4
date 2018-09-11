import React, { Component } from 'react';

export class FooterSkip extends Component {

    render() {
        return(
            <footer id="footer">
                <div class="container">
                    <div class="row">
                        <div class="col-6">
                        </div>
                        <div class="col-6">
                            <a>
                                <p onClick={this.props.action}> SKIP <i class="arrow right"></i></p>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }
}
