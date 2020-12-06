import React, { Component } from 'react';

import 'bootstrap/dist/css/bootstrap.css';
import "./Login.css";
import axios from 'axios';

export default class Login extends Component {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    constructor(props) {
        super(props);
    }

    validateForm() {
        return email.length > 0 && password.length > 0;
    }

    handleSubmit(event) {
        event.preventDefault();
    }


    render() {
        return (
            <div className="Login">
                <Form onSubmit={handleSubmit} action="/login">
                    <Form.Group size="lg" controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            autoFocus
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group size="lg" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>
                    <Button block size="lg" type="submit" disabled={!validateForm()}>
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