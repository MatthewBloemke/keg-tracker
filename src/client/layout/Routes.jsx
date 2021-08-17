import React from 'react'
import { Switch, Redirect, Route } from 'react-router';
import Login from '../Login';
import Dashboard from '../Dashboard';
import ListKegs from '../kegs/ListKegs';
import NewKeg from '../kegs/NewKeg';
import Shipping from '../shippingHistory/Shipping';

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
            <Route path="/kegs" exact={true}>
                <ListKegs/>
            </Route>
            <Route path="/kegs/new">
                <NewKeg/>
            </Route>
            <Route path="/shipping" exact={true}>
                <Shipping monthlyOnly={false}/>
            </Route>
            <Route path="/shipping/monthly">
                <Shipping monthlyOnly={true}/>
            </Route>
        </Switch>
    )
}

export default Routes;
