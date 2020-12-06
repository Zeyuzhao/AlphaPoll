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
            title: "",
            question: "",
            choices: [],
            pollURL: null,
            n: 0,
            choice_strs: []
        };

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
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            onChange={(e) => this.setState({ title: e.target.value })}/>
                    </Form.Group>
                    <Form.Group size="lg">
                        <Form.Label>Question</Form.Label>
                        <Form.Control
                            type="text"
                            onChange={(e) => this.setState({ question: e.target.value })}/>
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

    createChoice(i) {
        return (
            <Form.Group size="lg">
                <Form.Label>Choice</Form.Label>
                <Form.Control
                    type="text"
                    onChange={(e) => {
                        let arr = this.state.choice_strs.slice();
                        arr[i] = e.target.value;
                        this.setState({ choice_strs: arr});
                    }}
                />
            </Form.Group>
        );
    }

    handleAddChoice() {
        this.setState({
            choices: [...this.state.choices, this.createChoice(this.state.n++)],
            choice_strs: [...this.state.choice_strs, ""]
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        console.log(this.state.choice_strs);

        axios({
            method: 'post',
            url: "http://localhost:5000/polls/create",
            data: {
                token: cookies.get("token") || "",

                title: this.state.title,
                meta: {
                    type: "binary",
                    question: this.state.question,
                    categories: this.state.choice_strs
                }
            }
        })
        .then(res => {
            this.setState({
                pollURL: "localhost:3000/polls/" + res.data.id,
            });
        })
        .catch(err => {
            console.log(err);
        })
    }
}