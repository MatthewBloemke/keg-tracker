import React from 'react'
import { Switch, Redirect, Route } from 'react-router';
import Login from '../Login';
import Dashboard from '../Dashboard';
const Routes = () => {
    return (
        <Switch>
            <Route path='/login'>
                <Login/>
            </Route>
            <Route path="/" exact={true}>
                <Redirect to="/dashboard"/>
            </Route>
            <Route path="/dashboard" exact={true}>
                <Dashboard/>
            </Route>
        </Switch>
    )
}

export default Routes;
