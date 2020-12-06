import React, { Component, useState } from 'react';

import 'bootstrap/dist/css/bootstrap.css';
import "./Login.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from 'axios';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = { email: "", password: ""}
    }

    validateForm() {
        return this.state.email.length > 0 && this.state.password.length > 0;
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    render() {
        return (
            <div className="Login">
                <Form onSubmit={this.handleSubmit} action="/users/login">
                    <Form.Group size="lg" controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            autoFocus
                            type="email"
                            onChange={(e) => this.setState({ email: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group size="lg" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            onChange={(e) => this.setState({ password: e.target.value })}
                        />
                    </Form.Group>
                    <Button block size="lg" type="submit" disabled={!this.validateForm()}>
                        Login
                    </Button>
                </Form>
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