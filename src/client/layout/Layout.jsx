import React, { useEffect, useState } from 'react'
import Routes from './Routes';
import Menu from './Menu';
import "./Layout.css"; 
import { useHistory } from 'react-router-dom';
import { loginCheck } from '../utils/api';
import {Grid} from '@mui/material'

const Layout = () => {
    const history = useHistory();

    const [pathName, setPathName] = useState(window.location.pathname);

    history.listen((location) => {
        setPathName(location.pathname);
    });

    useEffect(() => {
        const abortController = new AbortController();
        loginCheck()
        .then(response => {
            if (!response) {
                history.push("/login") ; 
                return () => {
                    abortController.abort()
                };
            };
        });
        return () => abortController.abort();
    }, [pathName]);
    const height = {height: "100vh"};
    return (
        <main>
            <Grid container spacing={0}>
                <Grid item xs={12}>
                    <Grid container justifyContent="center" sx={{backgroundColor: '#1675d1', borderTop: "solid #004a9f 18px", borderBottom: 'solid #004a9f 4px'}}>
                        <h1 id="mainHeading">Loon Juice Keg Tracker</h1>
                    </Grid>
                </Grid>
                <Grid item xs={2} sx={{backgroundColor: '#1675d1', height: '100vh', borderRight: "solid #004a9f 3px"}}>
                    <Menu/>
                </Grid>
                <Grid item xs={10}>
                    <Routes/>
                </Grid>
            </Grid>
        </main>
    );
};

export default Layout;