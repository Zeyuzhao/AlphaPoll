import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Login from './pages/login/Login';
import Respond from './pages/respond/respond';
import Dashboard from './pages/dashboard/dashboard';
import Poll from './pages/dashboard/poll/poll';
import Create from './pages/create/create';
import {
    BrowserRouter, Route, Link, Switch
} from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
      <BrowserRouter>
          {/* <Link to='/dashboard'> Dashboard </Link>
          <Link to='/login'> Login </Link>
          <Link to='/create'> Create </Link> */}

          <Switch>
              <Route path="/login">
                  <Login />
              </Route>
              <Route path="/dashboard">
                  <Dashboard />
              </Route>
              <Route path="/create">
                  <Create />
              </Route>
              <Route path="/polls">
                  <Respond />
              </Route>
          </Switch>
      </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
