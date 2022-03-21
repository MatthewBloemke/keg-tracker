import React, { useEffect, useState } from 'react'
import {getKegs} from '../utils/api'
import {Card, CardContent, CardActions, Button, Typography} from "@mui/material";
import {makeStyles} from "@mui/styles"
import {Link} from 'react-router-dom'
import './dashboard.css'

const Dashboard = () => {
    
    const [kegs, setKegs] = useState([]) 
    const [returnedKegs, setReturnedKegs] = useState([])
    const [sixtyDayKegs, setSixtyDayKegs] = useState([])
    const [onetwentyDayKegs, setOnetwentyDayKegs] = useState([])
    const [overdueKegs, setOverdueKegs] = useState([])

    const useStyles = makeStyles({
        root: {
            width: "30%",
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
        }
        loadDashboard()
        return () => abortController.abort()
    }, [])

    const classes = useStyles();

    return (
        <div > 
            <h1 id="dashHeader">Dashboard</h1>
            <div className='cardContainer'>
                <Card className={classes.root} variant="outlined">
                    <CardContent>
                        <Typography className={classes.title}>Total Kegs In Sytem</Typography>
                        <Typography className={classes.pos}>{kegs ? kegs.length + " kegs in system" : null}</Typography>
                    </CardContent>
                    <CardActions>
                        <Button size='medium' component={Link} to="/kegs">View Kegs</Button>
                    </CardActions>
                </Card>
                <Card className={classes.root} variant="outlined">
                    <CardContent>
                        <Typography className={classes.title}>Total Kegs Returned</Typography>
                        <Typography className={classes.pos}>{returnedKegs ? returnedKegs.length + " kegs at the warehouse" : null}</Typography>
                    </CardContent>
                    <CardActions>
                        <Button size='medium'>View Returned Kegs</Button>
                    </CardActions>
                </Card>
                <Card className={classes.root} variant="outlined">
                    <CardContent>
                        <Typography className={classes.title}>Total Shipped Kegs</Typography>
                        <Typography className={classes.pos}>{kegs.length - returnedKegs.length + " kegs are shipped"}</Typography>
                    </CardContent>
                    <CardActions>
                        <Button size='medium' >View Shipped Kegs</Button>
                    </CardActions>
                </Card>
                <Card className={classes.root} variant="outlined">
                    <CardContent>
                        <Typography className={classes.title}>Number of Kegs out for less than 60 Days</Typography>
                        <Typography className={classes.pos}>{sixtyDayKegs ? sixtyDayKegs.length + " kegs in system" : null}</Typography>
                    </CardContent>
                    <CardActions>
                        <Button size='medium'>{'View Kegs out for <60 Days'}</Button>
                    </CardActions>
                </Card>
                <Card className={classes.root} variant="outlined">
                    <CardContent>
                        <Typography className={classes.title}>Number of Kegs out for more than 60 days and less than 120 days</Typography>
                        <Typography className={classes.pos}>{onetwentyDayKegs ? onetwentyDayKegs.length + " kegs out for over 60 days" : null}</Typography>
                    </CardContent>
                    <CardActions>
                        <Button size='medium' >{'View Kegs out for >60 days'}</Button>
                    </CardActions>
                </Card>
                <Card className={classes.root} variant="outlined">
                    <CardContent>
                        <Typography className={classes.title}>Number of Kegs out for over 120 days</Typography>
                        <Typography className={classes.pos}>{overdueKegs ? overdueKegs.length + " kegs out for over 120 days" : null}</Typography>
                    </CardContent>
                    <CardActions>
                        <Button size='medium' >{'View Kegs out for >120 days'}</Button>
                    </CardActions>
                </Card>                
            </div>

            {/* <p>Total Kegs {kegs ? kegs.length : null}</p>
            <p>Kegs returned {returnedKegs ? returnedKegs.length : null}</p>
            <p>Total shipped kegs {returnedKegs ? (kegs.length - returnedKegs.length) : null}</p>
            <p>0-60 Days {sixtyDayKegs ? sixtyDayKegs.length : null}</p>
            <p>60-120 Days {onetwentyDayKegs ? onetwentyDayKegs.length : null}</p>
            <p>120+ Days {overdueKegs ? overdueKegs.length : null}</p> */}
        </div>
    )
}

export default Dashboard