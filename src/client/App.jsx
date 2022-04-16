import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Layout from './layout/Layout'
import Login from './login/Login'
import { ThemeProvider, createTheme } from '@mui/material/styles'


const theme = createTheme({
    palette: {
        primary: {
            main: "#1976d2",
            light: '#63a4ff',
            dark: '#004ba0',
            contrastText: "#fff"
        },
        secondary: {
            light: '#ab4fff',
            main: '#7517d1',
            dark: '#3c009f',
            contrastText: '#fff',
        }
    },
})

const App = () => {

    return (
        <ThemeProvider theme={theme}>
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

    );
}

export default App;