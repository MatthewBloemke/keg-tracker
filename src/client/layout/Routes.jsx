import React from 'react'
import { Switch, Redirect, Route } from 'react-router';
import Login from '../login/Login';
import Dashboard from '../Dashboard';
import ListKegs from '../kegs/ListKegs';
import NewKeg from '../kegs/NewKeg';
import Shipping from '../shippingHistory/Shipping';
import TrackKeg from '../kegs/TrackKeg';
import EditKeg from '../kegs/EditKeg';
import ReturnKeg from '../kegs/ReturnKeg';

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
            <Route path="/kegs/track">
                <TrackKeg/>
            </Route>
            <Route path="/kegs/return">
                <ReturnKeg/>
            </Route>
            <Route path="/kegs/edit/:kegName">
                <EditKeg/>
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
