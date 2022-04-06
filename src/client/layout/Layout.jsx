import React, { useEffect, useState } from 'react'
import Routes from './Routes';
import SideMenu from './SideMenu';
import "./Layout.css"; 
import { useHistory } from 'react-router-dom';
import { loginCheck, logout } from '../utils/api';
import {AppBar, Grid, IconButton, Toolbar, Typography, MenuItem, Menu, Drawer} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
import { AccountCircle } from '@mui/icons-material';

const Layout = () => {
    const history = useHistory();

    const [pathName, setPathName] = useState(window.location.pathname);
    const [anchorEl, setAnchorEl] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

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
        await logout()
            .then(response => {
                if (response) {
                    history.push("/login")
                } else {
                    console.log('error logging out')
                }
            })
    }

    const editAccount = () => {
        setAnchorEl(null)
    }

    const closeDrawer = () => {
        setIsDrawerOpen(false)
    }

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
                                    <SideMenu closeDrawer={closeDrawer}/>
                                </Drawer>
                                <div>
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
                    <Routes/>
                </Grid>
            </Grid>
        </main>
    );
};

export default Layout;