import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Layout from './layout/Layout'
import Login from './login/Login'


const App = () => {

    return (
        <Router>
            <Switch>
                <Route path='/login'>
                    <Login/>
                </Route>
                <Route path="/">
                    <Layout/>
                </Route>
            </Switch>
        </Router>
    );
}

export default App;