import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Layout from './layout/Layout'
import Login from './login/Login'
import {ThemeProvider} from '@mui/material'
import customTheme from "./utils/theme"


const App = () => {
    return (
        <ThemeProvider theme={customTheme}>
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
        </ThemeProvider>

    )
}

export default App;