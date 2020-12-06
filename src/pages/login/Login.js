import React, { Component, useState } from 'react';

import 'bootstrap/dist/css/bootstrap.css';
import "./Login.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from 'axios';

import {
    BrowserRouter, Route, Link
} from "react-router-dom";
import Dashboard from "../dashboard/dashboard";

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = { email: "", password: ""}
        this.handleSubmit = this.handleSubmit.bind(this);

        // verifyUser();
    }

    // verifyUser() {
    //     axios({
    //         method: 'post',
    //         url: 'http://localhost:5000/user/verify',
    //         data: {
    //             token: // cookie
    //         }
    //     })
    // }

    validateForm() {
        return this.state.email.length > 0 && this.state.password.length > 0;
    }

    handleSubmit(e) {
        e.preventDefault();

        console.log("submitting");

        axios({
            method: 'post',
            url: 'http://localhost:5000/users/login',
            data: {
                name: this.state.name,
                email: this.state.email,
                password: this.state.password
            }
        })
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            });
    }

    render() {
        return (
            <BrowserRouter>
                <div className="Login">
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Group size="lg" controlId="email">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                autoFocus
                                type="text"
                                onChange={(e) => this.setState({ name: e.target.value })}
                            />
                        </Form.Group>
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

                <Route path="/dashboard" component={Dashboard}> </Route>
            </BrowserRouter>
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