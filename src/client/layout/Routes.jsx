import React from 'react'
import { Switch, Redirect, Route } from 'react-router-dom';
import Login from '../login/Login';
import Dashboard from '../dashboard/Dashboard';
import ListKegs from '../kegs/ListKegs';
import NewKeg from '../kegs/NewKeg';
import Shipping from '../shippingHistory/Shipping';
import TrackKeg from '../kegs/TrackKeg';
import EditKeg from '../kegs/EditKeg';
import ReturnKeg from '../kegs/ReturnKeg';
import ListDistributors from '../distributors/ListDistributors';
import NewDistributor from '../distributors/NewDistributor';
import EditDistributor from '../distributors/EditDistributor';
import ListEmployees from '../employees/ListEmployees';
import NewEmployee from '../employees/NewEmployee'
import EditEmployee from '../employees/EditEmployee';
import NewFlavor from '../flavors/NewFlavor';
import ListFlavors from '../flavors/ListFlavors';
import EditFlavor from '../flavors/EditFlavor';

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
            <Route path="/kegs/list/:status" exact={true}>
                <ListKegs/>
            </Route>
            <Route path="/kegs/new">
                <NewKeg/>
            </Route>
            <Route path="/kegs/track/:mode">
                <TrackKeg/>
            </Route>
            <Route path="/kegs/return/:mode">
                <ReturnKeg/>
            </Route>
            <Route path="/kegs/edit/:kegId">
                <EditKeg/>
            </Route>
            <Route path="/distributors" exact={true}>
                <ListDistributors/>
            </Route>
            <Route path="/distributors/new">
                <NewDistributor/>
            </Route>
            <Route path="/distributors/edit/:distributor_id">
                <EditDistributor/>
            </Route>
            <Route path="/shipping" exact={true}>
                <Shipping monthlyOnly={false}/>
            </Route>
            <Route path="/shipping/monthly">
                <Shipping monthlyOnly={true}/>
            </Route>
            <Route path='/employees' exact={true}>
                <ListEmployees/>
            </Route>
            <Route path='/employees/new'>
                <NewEmployee/>
            </Route>
            <Route path='/employees/edit/:employeeId'>
                <EditEmployee/>
            </Route>
            <Route path="/flavors" exact={true}>
                <ListFlavors/>
            </Route>
            <Route path="/flavors/new">
                <NewFlavor/>
            </Route>
            <Route path="/flavors/edit/:flavorId">
                <EditFlavor/>
            </Route>
        </Switch>
    )
}

export default Routes;
