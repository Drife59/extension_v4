import React, { Component } from 'react';

export class FooterPrevNext extends Component {

    render() {
        return(
            <footer id="footer">
            <div class="container">
                <div class="row">
                    <div class="col-6">
                        <a >
                            <p onClick={this.props.back_action}><i class="arrow left" ></i> BACK </p>
                        </a>
                    </div>
                    <div class="col-6">
                        <a >
                            <p onClick={this.props.next_action}> NEXT <i class="arrow right"></i></p>
                        </a>
                    </div>
                </div>
            </div>
            </footer>
        );
    }
}
