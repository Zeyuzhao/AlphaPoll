import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';

import axios from 'axios';

export default class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = { // hard coded for testing, should init to null when API done
            polls: [{
                meta: {
                  categories: [
                    "yes",
                    "no"
                  ],
                  type: "binary",
                  question: "Do you eat fast food"
                },
                data: [
                  {category: "yes", value: 10, CI: 2.3},
                  {category: "no", value: 20, CI: 1},
                  {category: "maybe", value: 4, CI: 0.4},
                ],
                active: true,
                _id: "5fcc420f887f5c19a1d59bd1",
                title: "Test",
                owner: "bob",
                date: "2020-12-06T02:29:35.080Z",
                __v: 0,
              }, {
                meta: {
                  categories: [
                    "yes",
                    "no"
                  ],
                  type: "binary",
                  question: "Do you eat fast food"
                },
                data: [
                  {category: "yes", value: 10, CI: 2.3},
                  {category: "no", value: 20, CI: 1},
                  {category: "maybe", value: 4, CI: 0.4},
                ],
                active: true,
                _id: "5fcc420f887f5c19a1d59bd1",
                title: "Test",
                owner: "bob",
                date: "2020-12-06T02:29:35.080Z",
                __v: 0,
              }, {
                meta: {
                  categories: [
                    "yes",
                    "no"
                  ],
                  type: "binary",
                  question: "Do you eat fast food"
                },
                data: [
                  {category: "yes", value: 10, CI: 2.3},
                  {category: "no", value: 20, CI: 1},
                  {category: "maybe", value: 4, CI: 0.4},
                ],
                active: true,
                _id: "5fcc420f887f5c19a1d59bd1",
                title: "Test",
                owner: "bob",
                date: "2020-12-06T02:29:35.080Z",
                __v: 0,
              }],
        };
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
                        <button class="btn btn-success my-2 my-sm-0" type="submit">Create New Poll</button>
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
                        </tr>
                    </thead>
                    <tbody>
                        {this.makeAllRows()}
                    </tbody>
                </table>
            </div>
        );
    }

    makeAllRows() {
        function makeRow(number, date, question, active) {
            return (
                <tr>
                    <th scope="row">{number}</th>
                    <td>{date}</td>
                    <td>{question}</td>
                    <td>{active ? "Active" : "Completed"}</td>
                    <td><a href="/">View</a></td>
                </tr>
            );
        }

        var rows = [];
        for (var i = 0; i < this.state.polls.length; i++) {
            const poll = this.state.polls[i];
            rows.push(makeRow(i + 1, poll.date, poll.meta.question, poll.active));
        }
        return rows;
    }

    /* Uncomment this code when API done. */

    // componentDidMount() {
    //     this.getPollIDs()
    //     .then(polls => {
    //         this.setState({
    //             polls: polls,
    //         });
    //     })
    // }

    // getPollIDs() {
    //     function getPoll(pollID) {
    //         const getLoc = pollID;
    
    //         return axios.get(getLoc)
    //         .then(res => {
    //             return res.data;
    //         })
    //         .catch(err => {
    //             console.log(err);
    //         });
    //     }

    //     const userID = "bob";
    //     const getLoc = "/users/" + userID + "/polls/";

    //     return axios.get(getLoc)
    //     .then(res => {
    //         return res.data.map(pollID => getPoll(pollID));
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     })
    // }
}
