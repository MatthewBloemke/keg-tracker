import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Layout from './layout/Layout'
import Login from './login/Login'
import {ThemeProvider} from '@mui/material'
import {createTheme} from '@mui/material'
import {blue, teal} from '@mui/material/colors';


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