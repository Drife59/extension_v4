import React, { Component } from 'react';

class App extends Component {
    
    constructor(props){
        super(props);
    }

    render() {

        return (
            <div id="menu" class="col-2">
                <a href="signout">
                    <img src="images/menu_icon.png" width="72%" />
                </a>
            </div>
        );
    }
}

export default App;
