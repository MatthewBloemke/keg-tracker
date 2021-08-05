import React from 'react'
import {Route, Switch} from 'react-router-dom'
import Layout from './layout/Layout'
import Login from './Login'

const App = () => {
    console.log("App")
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