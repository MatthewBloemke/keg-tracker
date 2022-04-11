import React, { useEffect, useState } from 'react'
import {getKegs, getShippingHistory, isAdmin} from '../utils/api'
import {Card, useMediaQuery, CardContent, CardActions, Button, Typography, AppBar, Divider} from "@mui/material";
import {makeStyles} from "@mui/styles"
import {useTheme} from '@mui/material/styles'
import './dashboard.css'
import { Link, useHistory } from 'react-router-dom';

const Dashboard = () => {
    const history = useHistory();
    const date = new Date(Date.now())
    date.setHours(0,0,0,0)
    const month = date.getUTCMonth()
    const year = date.getYear()
    const [kegs, setKegs] = useState([]) 
    const [returnedKegs, setReturnedKegs] = useState([])
    const [sixtyDayKegs, setSixtyDayKegs] = useState([])
    const [onetwentyDayKegs, setOnetwentyDayKegs] = useState([])
    const [overdueKegs, setOverdueKegs] = useState([])
    const [monthlyShipped, setMonthlyShipped] = useState([])
    const [monthlyReturned, setMonthlyReturned] = useState([])

    const theme = useTheme();
    const smallScreen = (!useMediaQuery(theme.breakpoints.up('sm')))

    const useStyles = makeStyles({
        root: {
            minWidth: '250px',
            width: '30%',
            maxWidth: "25%",
            marginLeft: "10px",
            marginTop: "5px"
        },
        title: {
          backgroundColor: 'white',
          fontSize: 14,
        },
        pos: {
          marginBottom: 12,
          backgroundColor: 'white',
        },
      });

    useEffect(() => {
        const abortController = new AbortController()
        const loadDashboard = async () => {
            const returnedKegsArr = []
            const sixtyDayKegArr = []
            const onetwentyDayKegArr = []
            const overdueKegArr = []
            await getKegs()
                .then(response => {
                    const tempKegs = response
                    for (let i = 0; i < tempKegs.length; i++) {
                        if (tempKegs[i].keg_status === "returned") {
                            returnedKegsArr.push(tempKegs[i])
                        } else {
                            let timeA = new Date();
                            let timeB = new Date(tempKegs[i].date_shipped)
                            timeA.setHours(0,0,0,0)
                            timeB.setHours(0,0,0,0)
                            let timeDifference = timeA.getTime() - timeB.getTime()
                            let daysDifference = timeDifference/1000/3600/24;
                            if (daysDifference < 60) {
                                sixtyDayKegArr.push(tempKegs[i])
                            } else if (daysDifference < 120) {
                                onetwentyDayKegArr.push(tempKegs[i])
                            } else {
                                overdueKegArr.push(tempKegs[i])
                            }
                        }
                    }
                    setKegs(response)
                    setReturnedKegs(returnedKegsArr)
                    setSixtyDayKegs(sixtyDayKegArr)
                    setOnetwentyDayKegs(onetwentyDayKegArr)
                    setOverdueKegs(overdueKegArr)
                })
            await getShippingHistory(abortController.signal)
                .then(response => {
                    const shippingList = []
                    const returnedList = []
                    response.forEach(entry => {
                        const tempDate = new Date(entry.date_shipped);
                        tempDate.setHours(0,0,0,0)
                        if (tempDate.getUTCMonth() === month && tempDate.getYear() === year) {
                            if (entry.keg_status === "shipped") {
                                shippingList.push(entry)
                            } else if (entry.keg_status === "returned") {
                                returnedList.push(entry)
                            }
                        }
                    })
                    setMonthlyShipped(shippingList)
                    setMonthlyReturned(returnedList)
                })
        }
        const adminCheck = async () => {
            await isAdmin(abortController.signal)
                .then(response => {
                    console.log("sent")
                    if (!response) {
                        console.log(response)
                        history.push('/kegs/track')
                        return () => {
                            abortController.abort()
                        };
                    } else {
                        console.log("user is an admin")
                    }
                })
        }
        adminCheck()
        loadDashboard()
        return () => abortController.abort()
    }, [])

    const classes = useStyles();

    return (
        <div id="dashboard">
            <Divider/>
            <AppBar position="static">
                <Typography variant='h5' textAlign={smallScreen ? "center": null} component="div" sx={{flexGrow: 1, pl: '10px', pb: '10px', pt: '10px'}}>
                    Dashboard
                </Typography>
            </AppBar>
            <div className='cardContainer'>
                <Card className={classes.root} variant="outlined">
                    <CardContent>
                        <Typography className={classes.title}>Total Kegs In Sytem</Typography>
                        <Typography className={classes.pos}>{kegs ? kegs.length + " kegs in system" : null}</Typography>
                    </CardContent>
                    <CardActions>
                        <Button component={Link} to="/kegs/list/shipped" size='medium' >View Kegs</Button>
                    </CardActions>
                </Card>
                <Card className={classes.root} variant="outlined">
                    <CardContent>
                        <Typography className={classes.title}>Total Kegs Returned</Typography>
                        <Typography className={classes.pos}>{returnedKegs ? returnedKegs.length + " kegs at the warehouse" : null}</Typography>
                    </CardContent>
                    <CardActions>
                        <Button component={Link} to="/kegs/list/returned" size='medium'>View Returned Kegs</Button>
                    </CardActions>
                </Card>
                <Card className={classes.root} variant="outlined">
                    <CardContent>
                        <Typography className={classes.title}>Total Shipped Kegs</Typography>
                        <Typography className={classes.pos}>{kegs.length - returnedKegs.length + " kegs are shipped"}</Typography>
                    </CardContent>
                    <CardActions>
                        <Button component={Link} to="/kegs/list/shipped" size='medium' >View Shipped Kegs</Button>
                    </CardActions>
                </Card>
                <Card className={classes.root} variant="outlined">
                    <CardContent>
                        <Typography className={classes.title}>Number of Kegs out for less than 60 Days</Typography>
                        <Typography className={classes.pos}>{sixtyDayKegs ? sixtyDayKegs.length + " kegs in system" : null}</Typography>
                    </CardContent>
                    <CardActions>
                        <Button component={Link} to={{pathname: "/kegs/list/shipped", state: sixtyDayKegs}} size='medium'>{'View Kegs out for <60 Days'}</Button>
                    </CardActions>
                </Card>
                <Card className={classes.root} variant="outlined">
                    <CardContent>
                        <Typography className={classes.title}>Number of Kegs out for more than 60 days and less than 120 days</Typography>
                        <Typography className={classes.pos}>{onetwentyDayKegs ? onetwentyDayKegs.length + " kegs out for over 60 days" : null}</Typography>
                    </CardContent>
                    <CardActions>
                        <Button size='medium' component={Link} to={{pathname: "/kegs/list/shipped", state: onetwentyDayKegs}} >{'View Kegs out for >60 days'}</Button>
                    </CardActions>
                </Card>
                <Card className={classes.root} variant="outlined">
                    <CardContent>
                        <Typography className={classes.title}>Number of Kegs out for over 120 days</Typography>
                        <Typography className={classes.pos}>{overdueKegs ? overdueKegs.length + " kegs out for over 120 days" : null}</Typography>
                    </CardContent>
                    <CardActions>
                        <Button size='medium' component={Link} to={{pathname: "/kegs/list/shipped", state: overdueKegs}} >{'View Kegs out for >120 days'}</Button>
                    </CardActions>
                </Card>
                <Card className={classes.root} variant="outlined">
                    <CardContent>
                        <Typography className={classes.title}>Number of Kegs Shipped this month</Typography>
                        <Typography className={classes.pos}>{monthlyShipped.length} kegs have been shipped this month</Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="medium" component={Link} to="/shipping/monthly" >View shipping history</Button>
                    </CardActions>
                </Card>
                <Card className={classes.root} variant="outlined">
                    <CardContent>
                        <Typography className={classes.title}>Number of Kegs Returned this month</Typography>
                        <Typography className={classes.pos}>{monthlyReturned.length} kegs have been returned this month</Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="medium" component={Link} to="/shipping/monthly" >View shipping history</Button>
                    </CardActions>
                </Card>
            </div>
        </div>
    )
}

export default Dashboard;