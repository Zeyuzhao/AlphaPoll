import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from 'axios';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
export default class Create extends Component {
    constructor(props) {
        super(props);

        this.state = {
            choices: [],
            pollURL: null,
        }

        this.handleAddChoice = this.handleAddChoice.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    render() {
        if (this.state.pollURL !== null) {
            return (
                <div className="create-poll-frame">
                    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                        <button className="btn btn-danger my-2 my-sm-0">Logout</button>
                        <div class="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul class="navbar-nav mr-auto ml-auto">
                                <li class="nav-item active">
                                    <a class="navbar-brand" href="/">AlphaPoll</a>
                                </li>
                            </ul>
                            <button class="btn btn-success my-2 my-sm-0" type="submit">Create New Poll</button>
                        </div>
                    </nav>
                    <h1>Your poll link is {this.state.pollURL}</h1>
                </div>
            )
        }
        return (
            <div className="create-poll-frame">
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <button className="btn btn-danger my-2 my-sm-0">Logout</button>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav mr-auto ml-auto">
                            <li class="nav-item active">
                                <a class="navbar-brand" href="/">AlphaPoll</a>
                            </li>
                        </ul>
                        <button class="btn btn-success my-2 my-sm-0" type="submit">Create New Poll</button>
                    </div>
                </nav>
                <h1 style={{textAlign: 'center', marginTop: '5%'}}>Create a New Poll</h1>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group size="lg">
                        <Form.Label>Question</Form.Label>
                        <Form.Control/>
                    </Form.Group>

                    <div id="choices">
                        {this.state.choices}
                    </div>

                    <Button onClick={this.handleAddChoice}>Add Choice</Button>
                    <p></p>
                    <Button type="submit">Create</Button>
                </Form>
            </div>
        );
    }

    createChoice() {
        return (
            <Form.Group size="lg">
                <Form.Label>Choice</Form.Label>
                <Form.Control/>
            </Form.Group>
        );
    }

    handleAddChoice() {
        this.setState({
            choices: [...this.state.choices, this.createChoice()],
        })
    }

    handleSubmit(e) {
        e.preventDefault();

        axios({
            method: 'post',
            url: "http://localhost:5000/polls/create",
            data: {
                token: cookies.get("token") || "",
                choices: this.state.choices
            }
        })
        .then(id => {
            this.setState({
                pollURL: "localhost:3000/polls/" + id,
            });
        })
        .catch(err => {
            console.log(err);
        })
    }
}