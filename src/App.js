import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { Disconnected } from './Disconnected';

class App extends Component {
    render() {
        return (
            <div className="App">
                <header id="header">
                    <div class="container">
                        <div class="row">
                            <div class="col-12">
                                <img src="images/logo_corail.png" width="100" />
                            </div>
                        </div>
                    </div>
                </header>

                <Disconnected />

                <script src="http://code.jquery.com/ui/1.9.2/jquery-ui.js"></script>
                <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
            </div>
        );
    }
}

export default App;
