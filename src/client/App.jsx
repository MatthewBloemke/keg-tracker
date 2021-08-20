import React from 'react'
import {Route, Switch} from 'react-router-dom'
import Layout from './layout/Layout'
import Login from './login/Login'

const App = () => {
    return (
        <Switch>
            <Route path='/login'>
                <Login/>
            </Route>
            <Route path="/">
                <Layout/>
            </Route>
        </Switch>
    )
}

export default App;