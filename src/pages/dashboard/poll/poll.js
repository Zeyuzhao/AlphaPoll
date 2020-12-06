import React, { Component } from 'react';

import axios from 'axios';

import CanvasJSReact from './../../../canvasjs/canvasjs.react';

export default class Poll extends Component {
    constructor(props) {
        super(props);

        this.state = {
            poll: {
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
              }
              
        }
    }

    render() {
        if (this.state.poll === null) {
            return null;
        }
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
                <BarGraph poll={this.state.poll}/>
            </div>
        );
    }

    /* Could do this GET request, can also pass in the poll as props. Whatever you want. */
    componentDidMount() {
        this.getPoll()
        .then(poll => {
            this.setState({
                poll: poll,
            });
        })
    }

    getPoll() {
        const pollID = "123abc";
        const getLoc = "/polls/view/" + pollID; 
        return axios.get(getLoc)
        .then(res => {
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