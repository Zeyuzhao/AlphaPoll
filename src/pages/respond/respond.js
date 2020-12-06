import React, { Component } from 'react';
import axios from 'axios';
import './respond.css';

import Button from "react-bootstrap/Button";

export default class PollResponse extends Component {
    constructor(props) {
        super(props);

        this.state = {
            poll: { // hard coded in, should init to null
                meta: {
                  categories: [
                    "yes",
                    "no",
                    "maybe",
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
              },
            id: null,
            chosen: false,
        };

        // this.componentDidMount = this.componentDidMount.bind(this);
        this.choose = this.choose.bind(this);
    }

    render() {
        console.log(this.state.poll);
        if (this.state.poll === null || this.state.poll === undefined) {
            return null;
        } else if (this.state.chosen) {
            return <Submitted />
        } else {
            return (
                <Poll poll={this.state.poll} id={this.state.id} choose={this.choose}/>
            );
        }
    }

    /* Uncomment when API finished */

    componentDidMount() {
        this.getPoll().then(res => {
            this.setState({
                poll: res.poll,
                id: res.id,
            });
        });
    }

    getPoll() {
        const domain = "http://localhost:3000";
        const path = "http://localhost:3000/polls/submit";
        const url = window.location.href;
        const id = url.substring(path.length);
        const getLoc = url.substring(domain.length);
        console.log(domain, path, url, id, getLoc);

        return axios.get("poo") //axios.get(getLoc)
        .then(res => {
            return {poll: res.data, id: id};
        })
        .catch(err => {
            console.log(err);
        });
    }

    choose() {
        this.setState({
            chosen: true,
        });
    }
}


class Poll extends Component {
    render() {
        return (
            <div className="poll-frame">
                <h1 className="poll-question" style={{textAlign: 'center', marginTop: '5%'}}>{this.props.poll.meta.question}</h1>
                <div className="choice-buttons">
                    {this.choices()}
                </div>
            </div>
        );
    }

    choices() {
        return this.props.poll.meta.categories.map((choice, i) => 
            <Button className="poll-choice" onClick={this.makeChoice(choice)} key={i} style={{width: '80%', margin: "1%", height: '100px'}}>{choice}</Button>
        )
    }

    makeChoice(choice) {
        const send = () => {
            axios.post("/polls/submit/" + this.props.id, choice)
            .then(res => {
                this.props.choose();
            })
            .catch(err => {
                console.log(err);
            })
        }
        return send;
    }
}


class Submitted extends Component {
    render() {
        return (
            <div className="poll-frame" style={{textAlign: 'center', marginTop: '15%'}}>
                <h1>Your response has been recorded!</h1>
                <h2>Thanks for responding!</h2>
            </div>
        );
    }
}
