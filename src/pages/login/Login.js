import React, { Component } from 'react';

import 'bootstrap/dist/css/bootstrap.css';
import "./Login.css";
import axios from 'axios';

export default class Login extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="login-frame">
                <div className="login-form">
                    <h1 className="login-header">Login to AlphaPoll</h1>
                    <GoogleLogin />
                </div>
            </div>
        )
    }
}

class GoogleLogin extends Component {
    render() {
        return (
            <button className="btn btn-primary google-login" onClick={this.handleClick}>Login with Google!</button>
        );
    }

    handleClick() {
        // axios.get("/login")
        // .then(res => {
        //     console.log(res);
        // })
        // .catch(err => {
        //     console.log(err);
        // })
    }
}