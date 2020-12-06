import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Login from './pages/login/Login';
import Dashboard from "./pages/dashboard/dashboard";
import {
    BrowserRouter, Route, Link, Switch
} from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
      <BrowserRouter>
          <Link to='/dashboard'> Dashboard </Link>
          <Link to='/login'> Login </Link>

          <Switch>
              <Route path="/login">
                  <Login />
              </Route>
              <Route path="/dashboard">
                  <Dashboard />
              </Route>
          </Switch>
      </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
