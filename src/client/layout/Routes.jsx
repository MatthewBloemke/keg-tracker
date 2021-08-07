import React from 'react'
import { Switch, Redirect, Route } from 'react-router';
import Login from '../Login';
import Dashboard from '../Dashboard';
import ListKegs from '../kegs/ListKegs';
const Routes = () => {
    return (
        <Switch>
            <Route path='/login' exact={true}>
                <Login/>
            </Route>
            <Route path="/" exact={true}>
                <Redirect to="/dashboard"/>
            </Route>
            <Route path="/dashboard" exact={true}>
                <Dashboard/>
            </Route>
            <Route path="/kegs">
                <ListKegs/>
            </Route>
        </Switch>
    )
}

export default Routes;
