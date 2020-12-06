import React, { Component } from 'react';
import axios from 'axios';

import Button from "react-bootstrap/Button";

export default class PollResponse extends Component {
    constructor(props) {
        super(props);

        this.state = {
            poll: null,
            chosen: false,
        };

        this.componentDidMount = this.componentDidMount.bind(this);
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
                <Poll poll={this.state.poll} choose={this.choose}/>
            );
        }
    }

    componentDidMount() {
        this.getPoll().then(poll => {
            this.setState({
                poll: poll,
            });
        });
    }

    getPoll() {
        const domain = "http://localhost:3000";
        const url = window.location.href;
        const location = url.substring(domain.length);
        console.log(domain, url, location);
        return axios.get("poo")
        .then(res => {
            return res.data;
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
                <h1 clasName="poll-question">{this.props.poll.meta.question}</h1>
                {this.choices()}
            </div>
        );
    }

    choices() {
        return this.props.poll.meta.categories.map((choice, i) => {
            <Button className="poll-choice" onClick={this.makeChoice(choice)} key={i}>{choice}</Button>
        })
    }

    makeChoice(choice) {
        return function send() {
            axios.post("url", choice)
            .then(res => {
                this.props.choose();
            })
            .catch(err => {
                console.log(err);
            })
        }
    }
}


class Submitted extends Component {
    render() {
        return (
            <div className="poll-frame">
                <h1>Your response has been recorded!</h1>
            </div>
        );
    }
}