import React, { Component } from 'react';
import axios from 'axios';
import './respond.css';

import Button from "react-bootstrap/Button";

export default class PollResponse extends Component {
    constructor(props) {
        super(props);

        this.state = {
            poll: null,
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
        const path = "http://localhost:3000/polls";
        const url = window.location.href;
        const id = url.substring(path.length);
        const getLoc = "http://localhost:5000/polls/view" + id;
        console.log(path, url, id, getLoc);

        return axios.get(getLoc)
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
            axios.post("http://localhost:5000/polls/submit" + this.props.id, {value: choice})
            .then(res => {
                console.log(res, res.data);
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
