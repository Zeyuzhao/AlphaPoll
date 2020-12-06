import React, { Component, useState } from 'react';

import axios from 'axios';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export default class Switcher extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: ""
        };

        if (window.location.href.endsWith("3000/")) {
            this.setState({text: "AlphaPoll loading..."});
            axios({
                method: 'post',
                url: 'http://localhost:5000/users/verify',
                data: {
                    token: cookies.get("token") || ""
                }
            })
                .then(res => {
                    console.log("a");
                    window.location.href += 'dashboard';
                    this.setState({text: ""});
                })
                .catch(err => {
                    console.log("b");
                    window.location.href += 'login';
                    this.setState({text: ""});
                })
        }
    }

    render() {
        return (
            <h1> {this.state.text} </h1>
        )
    }
}