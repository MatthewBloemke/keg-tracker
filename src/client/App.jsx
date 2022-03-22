import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Layout from './layout/Layout'
import Login from './login/Login'
import {ThemeProvider} from '@mui/material'
import {createTheme} from '@mui/material'
import {blue, teal} from '@mui/material/colors';


const App = () => {
    const customTheme = createTheme({
        palette: {
            primary: blue,
            secondary: teal
        }
    })

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
    );
}

export default App;