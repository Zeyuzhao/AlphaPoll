import axios from 'axios';
import React, { Component, useState } from 'react';

import 'bootstrap/dist/css/bootstrap.css';
import "./dashboard.css";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export default class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = { // hard coded for testing, should init to null when API done
            polls: [],
        };

        this.makeAllRows = this.makeAllRows.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    render() {
        if (this.state.polls === []) {
            return null;
        }
        return (
            <div className="dashboard-frame">
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <button className="btn btn-danger my-2 my-sm-0">Logout</button>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav mr-auto ml-auto">
                            <li class="nav-item active">
                                <a class="navbar-brand" href="/">AlphaPoll</a>
                            </li>
                        </ul>
                        <button class="btn btn-success my-2 my-sm-0" type="submit" onClick={this.createPoll}>Create New Poll</button>
                    </div>
                </nav>
                <h1 style={{textAlign: 'center'}}>Your Polls</h1>
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Date</th>
                            <th scope="col">Question</th>
                            <th scope="col">Status</th>
                            <th scope="col">View</th>
                            <th scope="col">Close</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.makeAllRows()}
                    </tbody>
                </table>
            </div>
        );
    }

    createPoll() {
        window.location.href = "http://localhost:3000/create";
    }

    makeAllRows() {
        const makeRow = (number, date, question, active, id) => {
            return (
                <tr>
                    <th scope="row">{number}</th>
                    <td>{date}</td>
                    <td>{question}</td>
                    <td>{active ? "Active" : "Completed"}</td>
                    <td><a href={"/results/" + id}>View</a></td>
                    <td>{active ? <button className="btn btn-primary" onClick={this.closePoll(id)}>Close Poll</button> : null}</td>
                </tr>
            );
        }

        var rows = [];
        for (var i = 0; i < this.state.polls.length; i++) {
            const poll = this.state.polls[i];
            rows.push(makeRow(i + 1, poll.date, poll.meta.question, poll.active, poll._id));
        }
        return rows;
    }

    closePoll(id) {
        const close = () => {
            const postLoc = "http://localhost:5000/polls/deactivate/" + id;
            console.log(postLoc);
            axios.post(postLoc, {data: {token: cookies.get("token") || "",}})
            .then(res => {
                
            })
            .catch(err => {
                console.log(err);
            })
        }

        return close;
    }

    /* Uncomment this code when API done. */

    componentDidMount() {
        this.getPollIDs()
        .then(polls => {
            this.setState({
                polls: polls,
            });
        })
    }

    getPollIDs() {
        function getPoll(pollID) {
            const getLoc = "http://localhost:5000/polls/view/" + pollID;
    
            return axios.get(getLoc)
            .then(res => {
                return res.data;
            })
            .catch(err => {
                console.log(err);
            });
        }

        const token = cookies.get("token");
        const getLoc = "http://localhost:5000/polls/all";
        const obj = {token: token};

        console.log(token);
        return axios({
            method: 'post',
            url: "http://localhost:5000/polls/all",
            data: {
                token: cookies.get("token") || "",
            }
        })
        .then(async res => {
            console.log(res.data);
            var polls = []
            for (var i = 0; i < res.data.polls.length; i++) {
                const pollID = res.data.polls[i];
                const poll = await getPoll(pollID)
                polls.push(poll);
            }
            return polls;
        })
        .catch(err => {
            console.log(err);
        })
    }
}
