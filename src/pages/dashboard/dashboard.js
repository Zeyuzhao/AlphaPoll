import React, { Component, useState } from 'react';

import 'bootstrap/dist/css/bootstrap.css';
import "./dashboard.css";

export default class Dashboard extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <h1> You've reached the dashboard! congrats </h1>
        )
    }
}
