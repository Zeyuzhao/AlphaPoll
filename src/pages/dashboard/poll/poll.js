import React, { Component } from 'react';

import axios from 'axios';

import CanvasJSReact from './../../../canvasjs/canvasjs.react';

export default class Poll extends Component {
    constructor(props) {
        super(props);

        this.state = {
            poll: null,
            available: false,
        }
    }

    render() {
        if (this.state.poll === null) {
            return null;
        }
        console.log(this.state.available);
        return (
            <div className="poll-frame">
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
                {this.state.available ? <BarGraph poll={this.state.poll}/> : <Unavailable />}
            </div>
        );
    }

    componentDidMount() {
        this.getPoll()
        .then(res => {
            if (res.response === "failure") {
                this.setState({
                    poll: "bad poll",
                    available: false,
                });
            } else {
                this.setState({
                    poll: res,
                    available: true,
                });
            }
        })
    }

    getPoll() {
        const path = "http://localhost:3000/results";
        const url = document.location.href;
        const pollID = url.substring(path.length);
        const getLoc = "http://localhost:5000/polls/results" + pollID; 
        return axios.get(getLoc)
        .then(res => {
            console.log(res.data);
            return res.data;
        })
    }
}



class BarGraph extends Component {
    render() {
        const options = {
			animationEnabled: true,
			theme: "light2",
			title:{
				text: this.props.poll.meta.question,
            },
            toolTip: {
                content: "{label}: {y} <br/> Confidence Interval (95%): {CI}",
            },
			axisX: {
				title: "Categories",
				reversed: true,
			},
			axisY: {
				title: "Percent",
				includeZero: true,
				labelFormatter: this.addSymbols,
			},
			data: [{
                type: "doughnut",
                explodeOnClick: true,
                dataPoints: this.getDataPoints(),
			}]
        }
        
        return (
            <div style={{marginTop: "10%"}}>
                <CanvasJSReact.CanvasJSChart options={options}></CanvasJSReact.CanvasJSChart>
            </div>
        );
    }

    getDataPoints() {
        var dataPoints = []
        for (var key in this.props.poll.data) {
            const data = this.props.poll.data[key];
            dataPoints.push({y: data.value, label: data.category, CI: data.CI})
        }
        return dataPoints;
    }
}


class Unavailable extends Component {
    render() {
        return (
            <div style={{textAlign: 'center', marginTop: '10%'}}>
                <h1>This poll is still active</h1>
                <h2>To see the poll results, close the poll!</h2>
            </div>
        )
    }
}