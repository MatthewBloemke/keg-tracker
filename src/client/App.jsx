import React from 'react'
import Login from './Login'
import {Route, Switch, Redirect} from 'react-router-dom'
import Dashboard from './Dashboard'

const App = () => {
    return (
        <Switch>
            <Route path='/login'>
                <Login/>
            </Route>
            {/* <Route path="/" exact={true}>
                <Redirect to="/dashboard"/>
            </Route> */}
            <Route path="/dashboard" exact={true}>
                <Dashboard/>
            </Route>
        </Switch>
    )
}

export default App;