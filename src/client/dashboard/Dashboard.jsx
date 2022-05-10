import React, { useEffect, useState } from 'react';
import { getKegs, getShippingHistory, isAdmin, standardizeDate} from '../utils/api';
import {Card, useMediaQuery, CardContent, CardActions, Button, Typography, Alert, CardMedia} from "@mui/material";
import {makeStyles} from "@mui/styles";
import {useTheme} from '@mui/material/styles';
import './dashboard.css';
import { Link, useHistory } from 'react-router-dom';



const Dashboard = () => {
    const history = useHistory();
    const date = new Date(Date.now());
    date.setHours(0,0,0,0);
    const month = date.getUTCMonth();
    const year = date.getYear();

    const [kegs, setKegs] = useState([]);
    const [returnedKegs, setReturnedKegs] = useState([]);
    const [sixtyDayKegs, setSixtyDayKegs] = useState([]);
    const [onetwentyDayKegs, setOnetwentyDayKegs] = useState([]);
    const [overdueKegs, setOverdueKegs] = useState([]);
    const [monthlyShipped, setMonthlyShipped] = useState([]);
    const [monthlyReturned, setMonthlyReturned] = useState([]);
    const [error, setError] = useState(null);

    const theme = useTheme();
    const smallScreen = (!useMediaQuery(theme.breakpoints.up('sm')));
    const largeScreen = (!useMediaQuery(theme.breakpoints.up('lg')));

    const useStyles = makeStyles({
        root: {
            minWidth: '250px',
            width: '20%',
            maxWidth: "25%",
            marginLeft: "10px",
            marginTop: "5px",
            marginBottom: "10px",
            height: "175px"
        },
        image: {
            minWidth: '250px',
            width: '20%',
            maxWidth: "25%",
            marginLeft: "10px",
            marginTop: "5px",
            marginBottom: "10px",
            minHeight: "150px"
        },
        title: {
          fontSize: 14,
        },
        pos: {
          marginBottom: 12,
        },
      });

    useEffect(() => {
        const abortController = new AbortController();

        const loadDashboard = async () => {
            const returnedKegsArr = [];
            const sixtyDayKegArr = [];
            const onetwentyDayKegArr = [];
            const overdueKegArr = [];

            await getKegs()
                .then(response => {
                    if (response.error) {
                        if (error) {
                            setError(error + ", " + response.error);
                        } else {
                            setError(response.error);
                        };
                    } else {
                        const tempKegs = response;
                        for (let i = 0; i < tempKegs.length; i++) {
                            if (tempKegs[i].keg_status === "returned") {
                                returnedKegsArr.push(tempKegs[i]);
                            } else {
                                let timeA = new Date();
                                let timeB = new Date(tempKegs[i].date_shipped);
                                timeA.setHours(0,0,0,0);
                                timeB.setHours(0,0,0,0);
                                let timeDifference = timeA.getTime() - timeB.getTime();
                                let daysDifference = timeDifference/1000/3600/24;
                                if (daysDifference < 60) {
                                    sixtyDayKegArr.push(tempKegs[i]);
                                } else if (daysDifference < 120) {
                                    onetwentyDayKegArr.push(tempKegs[i]);
                                } else {
                                    overdueKegArr.push(tempKegs[i]);
                                };
                            };
                        };
                        setKegs(response);
                        setReturnedKegs(returnedKegsArr);
                        setSixtyDayKegs(sixtyDayKegArr);
                        setOnetwentyDayKegs(onetwentyDayKegArr);
                        setOverdueKegs(overdueKegArr);                    
                    };
                });
            await getShippingHistory(abortController.signal)
                .then(response => {
                    if (response.error) {
                        if (error) {
                            setError(error + ", " + response.error);
                        } else {
                            setError(response.error);
                        };
                    } else {
                        const shippingList = [];
                        const returnedList = [];

                        response.forEach(entry => {
                            const utcDate = standardizeDate(entry.date_shipped);
                            const tempDate = new Date(Date.UTC(utcDate.year, utcDate.month - 1, utcDate.day, 5));
                            if (tempDate.getMonth() === month && tempDate.getYear() === year) {
                                if (entry.keg_status === "shipped") {
                                    shippingList.push(entry);
                                } else if (entry.keg_status === "returned") {
                                    returnedList.push(entry);
                                };
                            };
                        });

                        setMonthlyShipped(shippingList);
                        setMonthlyReturned(returnedList);                     
                    };
                });
        };

        const adminCheck = async () => {
            await isAdmin(abortController.signal)
                .then(response => {
                    if (!response) {
                        history.push('/kegs/track/environment');
                        return () => {
                            abortController.abort();
                        };
                    };
                });
        };

        adminCheck();
        loadDashboard();

        return () => abortController.abort();
    }, []);

    const classes = useStyles();

    return (
        <div id="dashboard">
             <div className='cardContainer'>
                {error ? <Alert onClose={() => {setError(null)}} sx={{width: "30%", minWidth: "250px", margin: "auto", marginTop: "20px"}} variant="filled" severity="error">{error}</Alert>: null}
                {smallScreen ? 
                    <Card className={classes.root} elevation={3}>
                        <CardMedia
                            component='img'
                            width="20%"
                            image="https://res.cloudinary.com/ratebeer/image/upload/w_400,c_limit/brew_20712.jpg"
                            alt="logo"
                        />
                    </Card> : null 
                }
                <Card elevation={3} className={classes.root}>
                    <CardContent>
                        <Typography className={classes.title}>Total Kegs In Sytem</Typography>
                        <Typography className={classes.pos}>{kegs ? kegs.length + " kegs in system" : null}</Typography>
                    </CardContent>
                    <CardActions sx={{marginTop: "44px"}}>
                        <Button component={Link} to="/kegs/list/shipped" size='medium' >View Kegs</Button>
                    </CardActions>
                </Card>
                <Card className={classes.root} elevation={3}>
                    <CardContent>
                        <Typography className={classes.title}>Total Kegs Returned</Typography>
                        <Typography className={classes.pos}>{returnedKegs ? returnedKegs.length + " kegs at the warehouse" : null}</Typography>
                    </CardContent>
                    <CardActions sx={{marginTop: "44px"}}>
                        <Button component={Link} to="/kegs/list/returned" size='medium'>View Returned Kegs</Button>
                    </CardActions>
                </Card>
                <Card className={classes.root} elevation={3}>
                    <CardContent>
                        <Typography className={classes.title}>Total Shipped Kegs</Typography>
                        <Typography className={classes.pos}>{kegs.length - returnedKegs.length + " kegs are shipped"}</Typography>
                    </CardContent>
                    <CardActions sx={{marginTop: "44px"}}>
                        <Button component={Link} to="/kegs/list/shipped" size='medium' >View Shipped Kegs</Button>
                    </CardActions>
                </Card>
                <Card className={classes.root} elevation={3}>
                    <CardContent>
                        <Typography className={classes.title}>{`There are ${sixtyDayKegs ? sixtyDayKegs.length : 0} kegs that have been out for less than 60 days`}</Typography>
                    </CardContent>
                    <CardActions sx={{marginTop: largeScreen ? "20px" : "44px"}}>
                        <Button component={Link} to={{pathname: "/kegs/list/shipped", state: sixtyDayKegs}} size='medium'>{'View Kegs'}</Button>
                    </CardActions>
                </Card>
                <Card className={classes.root} elevation={3}>
                    <CardContent>
                        <Typography className={classes.title}>{`There are ${onetwentyDayKegs ? onetwentyDayKegs.length : 0} kegs that have been out for more than 60 days`}</Typography>
                    </CardContent>
                    <CardActions sx={{marginTop: largeScreen ? "20px" : "44px"}}>
                        <Button size='medium' component={Link} to={{pathname: "/kegs/list/shipped", state: onetwentyDayKegs}} >{'View Kegs'}</Button>
                    </CardActions>
                </Card>
                <Card className={classes.root} elevation={3}>
                    <CardContent>
                        <Typography className={classes.title}>{`There are ${overdueKegs ? overdueKegs.length : 0} kegs that have been out for more than 120 days`}</Typography>
                    </CardContent>
                    <CardActions sx={{marginTop: largeScreen ? "20px" : "44px"}}>
                        <Button size='medium' component={Link} to={{pathname: "/kegs/list/shipped", state: overdueKegs}} >{'View Kegs'}</Button>
                    </CardActions>
                </Card>
                <Card className={classes.root} elevation={3}>
                    <CardContent>
                        <Typography className={classes.title}>There are a total of {monthlyShipped.length} kegs that have been shipped this month</Typography>
                    </CardContent>
                    <CardActions sx={{marginTop: largeScreen ? "20px" : "44px"}}>
                        <Button size="medium" component={Link} to="/shipping/monthly" >View shipping history</Button>
                    </CardActions>
                </Card>
                <Card className={classes.root} elevation={3}>
                    <CardContent>
                        <Typography className={classes.title}>There are a total of {monthlyReturned.length} kegs that have been returned this month</Typography>
                    </CardContent>
                    <CardActions sx={{marginTop: largeScreen ? "20px" : "44px"}}>
                        <Button size="medium" component={Link} to="/shipping/monthly" >View shipping history</Button>
                    </CardActions>
                </Card>
                {!smallScreen ? 
                    <Card className={classes.image} elevation={3}>
                        <CardMedia
                            component='img'
                            width="20%"
                            image="https://res.cloudinary.com/ratebeer/image/upload/w_400,c_limit/brew_20712.jpg"
                            alt="logo"
                        />
                    </Card> : null 
                }
            </div>
        </div>
    );
};

export default Dashboard;