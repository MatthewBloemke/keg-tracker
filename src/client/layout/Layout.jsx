import React, { useEffect, useState } from 'react'
import Routes from './Routes';
import SideMenu from './SideMenu';
import "./Layout.css";
import {useTheme} from '@mui/material/styles'
import { useHistory } from 'react-router-dom';
import { loginCheck, logout, isAdmin } from '../utils/api';
import {AppBar, Grid, IconButton, Toolbar, Typography, MenuItem, Menu, Drawer, useMediaQuery} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
import { AccountCircle } from '@mui/icons-material';
import KegOnlyMenu from './KegOnlyMenu'

const Layout = () => {
    const history = useHistory();

    const [pathName, setPathName] = useState(window.location.pathname);
    const [anchorEl, setAnchorEl] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [error, setError] = useState(null)
    const [admin, setAdmin] = useState(true)
    const theme = useTheme()
    const smallScreen = (!useMediaQuery(theme.breakpoints.up('sm')))

    history.listen((location) => {
        setPathName(location.pathname);
    });

    const handleAccountMenu = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handleAccountClose = () => {
        setAnchorEl(null)
    }

    const onLogout = async () => {
        const controller = new AbortController()
        await logout(controller.signal)
            .then(response => {
                if (response.error) {
                    setError(response.error)
                } else {
                    localStorage.removeItem("user")
                    localStorage.removeItem("name")
                    localStorage.removeItem("id")
                    history.push("/login")
                    history.go(0)
                }
            })
    }

    const editAccount = () => {
        history.push(`/employees/edit/${localStorage.getItem("id")}`)
        setAnchorEl(null)
    }

    const closeDrawer = () => {
        setIsDrawerOpen(false)
    }

    useEffect(() => {
        const abortController = new AbortController();
        loginCheck(abortController.signal)
            .then(response => {
                if (!response) {
                    history.push("/login") ; 
                    return () => {
                        abortController.abort()
                    };
                };
            });
        const adminCheck = async () => {
            await isAdmin(abortController.signal)
                .then(response => {
                    if (!response) {
                        setAdmin(false)
                    } else {
                        setAdmin(true)
                    }
                })
        }
        adminCheck()
        return () => abortController.abort();
    }, [pathName, admin]);
    

    return (
        <main>
            <Grid container justifyContent="center" >
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{mr: 2}}
                            onClick={() => setIsDrawerOpen(true)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant='h5' component="div" sx={{flexGrow: 1}}>
                            Loon Juice Keg Tracker
                        </Typography>
                        <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
                            {admin ? <SideMenu closeDrawer={closeDrawer}/> : <KegOnlyMenu closeDrawer={closeDrawer}/>}
                        </Drawer>
                        <div style={{display: "flex"}}>
                            {!smallScreen ? 
                            <Typography variant='h6' component="div" sx={{mt: "8px"}}>
                                {localStorage.getItem("name")}
                            </Typography> : null }
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleAccountMenu}
                                color="inherit"
                            >
                                <AccountCircle/>
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right'
                                }}
                                open={Boolean(anchorEl)}
                                onClose={handleAccountClose}
                            >
                                <MenuItem onClick={editAccount}>My Account</MenuItem>
                                <MenuItem onClick={onLogout}>Logout</MenuItem>
                            </Menu>
                        </div>
                    </Toolbar>
                </AppBar>
                <Grid item xs={12}>
                    {error ? <Alert onClose={() => {setError(null)}} sx={{width: "40%", margin: "auto", marginTop: "20px"}} variant="filled" severity="error">{error}</Alert>: null}
                    <Routes/>
                </Grid>
            </Grid>
        </main>
    );
};

export default Layout;