import React, { useEffect, useState } from 'react'
import Routes from './Routes';
import SideMenu from './SideMenu';
import "./Layout.css";
import {useTheme} from '@mui/material/styles'
import { useHistory } from 'react-router-dom';
import { loginCheck, logout, isAdmin } from '../utils/api';
import {AppBar, Grid, IconButton, Toolbar, Typography, MenuItem, Menu, Drawer, useMediaQuery, Avatar, Divider} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
import KegOnlyMenu from './KegOnlyMenu'
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
    root: {
        '&.MuiAvatar-root': {
            backgroundColor: theme.palette.secondary.main,
            width: 32, 
            height: 32            
        }
    },
    appBar: {
        '&.MuiAppBar-root': {
            backgroundColor: theme.palette.primary.dark,
            height: '12px'
        }    
    }
}))


const Layout = () => {
    const history = useHistory();
    const classes = useStyles()
    const [pathName, setPathName] = useState(window.location.pathname);
    const [anchorEl, setAnchorEl] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [error, setError] = useState(null)
    const [admin, setAdmin] = useState(true)
    const theme = useTheme()
    const [heading, setHeading] = useState("Dashboard")
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
        console.log(pathName)
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
        const changeHeading = () => {
            if (pathName ==='/dashboard') {
                setHeading("Dashboard")
            } else if (pathName === "/kegs/list/shipped") {
                setHeading("Shipped Kegs")
            } else if (pathName === "/kegs/list/returned") {
                setHeading("Returned Kegs")
            } else if (pathName === "/kegs/new") {
                setHeading("Create Keg")
            } else if (pathName.includes("/kegs/track")) {
                setHeading("Ship Kegs")
            } else if (pathName.includes("/kegs/return")) {
                setHeading("Return Kegs")
            } else if (pathName.includes("/kegs/fill")) {
                setHeading("Fill Kegs")
            } else if (pathName.includes("/kegs/edit")) {
                setHeading("Edit Keg")
            } else if (pathName === "/distributors") {
                setHeading("Distributors")
            } else if (pathName === "/distributors/new") {
                setHeading("Create Distributor")
            } else if (pathName.includes("/distributors/edit")) {
                setHeading("Edit Distributor")
            } else if (pathName === "/shipping") {
                setHeading("Daily Shipping Report")
            } else if (pathName === "/shipping/monthly") {
                setHeading("Monthly Shipping Report")
            } else if (pathName === "/employees") {
                setHeading("Employees")
            } else if (pathName === "/employees/new") {
                setHeading("Create Employee")
            } else if (pathName.includes("/employees/edit")) {
                setHeading("Edit Employee")
            } else if (pathName === "/flavors") {
                setHeading("Flavors")
            } else if (pathName === "/flavors/new") {
                setHeading("Create Flavors")
            } else if (pathName.includes("/flavors/edit")) {
                setHeading("Edit Flavor")
            } else if (pathName === "/filling") {
                setHeading("Daily Filling Report")
            } else if (pathName === "/filling/monthly") {
                setHeading("Monthly Filling Report")
            }
        }
        adminCheck()
        changeHeading()
        return () => abortController.abort();
    }, [pathName, admin, window.location.pathname]);
    

    return (
        <main>
            <Grid container justifyContent="center" >
                <AppBar className={classes.appBar} position="static"></AppBar>
                <AppBar position="static" sx={{marginBottom: "25px"}}>
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{marginRight: "10px"}}
                            onClick={() => setIsDrawerOpen(true)}
                        >
                            <MenuIcon />
                        </IconButton>
                        
                        <Typography variant='h5' component="div" sx={{flexGrow: 1}}>
                            {heading}
                        </Typography>
                        <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
                            {admin ? <SideMenu closeDrawer={closeDrawer}/> : <KegOnlyMenu closeDrawer={closeDrawer}/>}
                        </Drawer>
                        <div style={{display: "flex"}}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                sx={{ ml: 2}}
                                onClick={handleAccountMenu}
                                color="inherit"
                            >
                                <Avatar className={classes.root}>{localStorage.getItem("name")? localStorage.getItem("name")[0]: null}</Avatar>
                            </IconButton>
                            <Menu
                            sx={{marginLeft: "-9px", marginTop: "-10px"}}
                                id="account-menu"
                                PaperProps={{
                                    elevation: 0,
                                    sx: {
                                      overflow: 'visible',
                                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                      mt: 1.5,
                                      '& .MuiAvatar-root': {
                                        width: 32,
                                        height: 32,
                                        mr: 1,
                                      },
                                      '&:before': {
                                        content: '""',
                                        display: 'block',
                                        position: 'absolute',
                                        top: 0,
                                        right: 14,
                                        width: 10,
                                        height: 10,
                                        bgcolor: 'background.paper',
                                        transform: 'translateY(-50%) rotate(45deg)',
                                        zIndex: 0,
                                      },
                                    },
                                  }}
                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleAccountClose}
                            >
                                <MenuItem onClick={editAccount}>My Account</MenuItem>
                                <Divider/>
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