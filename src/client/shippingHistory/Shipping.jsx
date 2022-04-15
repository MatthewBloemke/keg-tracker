import React, { useEffect, useState } from 'react'
import { getDistributors, getKegs, getShippingHistory, isAdmin } from '../utils/api'
import FormatShipping from './FormatShipping'
import DateFnsUtils from '@mui/lab/AdapterDateFns'
import {LocalizationProvider, DatePicker, } from '@mui/lab'
import {TextField, Grid, Divider, AppBar, Typography, useMediaQuery, Card, CardContent, CardActions, Button} from '@mui/material'
import { useTheme } from "@mui/material/styles";
import {makeStyles} from "@mui/styles"
import { Link, useHistory } from 'react-router-dom'

const Shipping = ({monthlyOnly}) => {
    const history = useHistory()
    const [shipping, setShipping] = useState([])
    const [monthlyShipped, setMonthlyShipped] = useState([])
    const [monthlyReturned, setMonthlyReturned] = useState([])
    const [date, setDate] = useState(new Date(Date.now()))
    const [kegs, setKegs] = useState([]);
    const [distributors, setDistributors] = useState([]);    
    const [error, setError] = useState(null)
    const theme = useTheme();
    const smallScreen = (!useMediaQuery(theme.breakpoints.up('sm')))
    date.setHours(0,0,0,0)
    const month = date.getUTCMonth()
    const year = date.getYear()
    console.log(date)

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

    const classes = useStyles();

    useEffect(() => {
        const abortController = new AbortController()
        const loadShippingHistory = async () => {
            await getShippingHistory(abortController.signal)
                .then(response => {
                    if (response.error) {
                        setError(response.error)
                    } else {
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
                        setShipping(response)
                    }
                })
        }
        const loadKegs = async () => {
            await getKegs(abortController.signal)
                .then(response => {
                    if (response.error) {
                        setError(response.error)
                    } else {
                        setKegs(response)
                    }
                })
        }
        const loadDistributors = async () => {
            await getDistributors(abortController.signal)
                .then(response => {
                    if (response.error) {
                        setError(response.error)
                    } else {
                        setDistributors(response)
                    }
                })
        }
        const adminCheck = async () => {
            await isAdmin(abortController.signal)
                .then(response => {
                    if (!response) {
                        history.push('/kegs/track/environment')
                        return () => {
                            abortController.abort()
                        };
                    } else {
                        console.log("user is an admin")
                    }
                })
        }
        adminCheck()
        loadShippingHistory()
        loadKegs()
        loadDistributors()
        return () => abortController.abort()
    }, [])

    return (
        <Grid container spacing={3}>
            <Grid container sx={{display: 'flex', flexDirection:"row", flexWrap: "wrap", justifyContent: "space-evenly", marginTop: "10px"}}>
                <Card className={classes.root} elevation={3}>
                    <CardContent>
                        <Typography className={classes.title}>Number of Kegs Shipped this month</Typography>
                        <Typography className={classes.pos}>{monthlyShipped.length} kegs have been returned this month</Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="medium" component={Link} to="/shipping/monthly" >View shipping history</Button>
                    </CardActions>
                </Card>
                <Card className={classes.root} elevation={3}>
                    <CardContent>
                        <Typography className={classes.title}>Number of Kegs Returned this month</Typography>
                        <Typography className={classes.pos}>{monthlyReturned.length} kegs have been returned this month</Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="medium" component={Link} to="/shipping/monthly" >View shipping history</Button>
                    </CardActions>
                </Card>
            </Grid>
            <Grid item xs={12}>
                <Grid container textAlign='center'>
                    <Grid item xs={12}>
                        {error ? <Alert onClose={() => {setError(null)}} sx={{width: "40%", margin: "auto", marginTop: "20px"}} variant="filled" severity="error">{error}</Alert>: null}
                        {monthlyOnly ?
                            <LocalizationProvider dateAdapter={DateFnsUtils}>
                                <DatePicker
                                    sx={{minWidth: "250px", width: "10%"}}
                                    views={['year', 'month']}
                                    label="Year and Month"
                                    minDate={new Date('2012-03-01')}
                                    maxDate={new Date('2023-06-01')}
                                    value={date}
                                    onChange={(newDate) => {
                                    setDate(newDate);
                                    }}
                                    renderInput={(params) => <TextField {...params} helperText={null} />}
                                />                
                            </LocalizationProvider> 
                            :
                            <LocalizationProvider dateAdapter={DateFnsUtils}>
                                <DatePicker
                                    sx={{minWidth: "250px", width: "10%"}}
                                    views={['year', 'month', 'day']}
                                    label="Year, Month, and Date"
                                    minDate={new Date('2012-03-01')}
                                    maxDate={new Date('2023-06-01')}
                                    value={date}
                                    onChange={(newDate) => {
                                    setDate(newDate);
                                    }}
                                    renderInput={(params) => <TextField {...params} helperText={null} />}
                                />
                            </LocalizationProvider>
                        }
                    </Grid>

                </Grid>

            </Grid>
            <Grid item xs={12}>
                <FormatShipping shippingList={shipping} date={date} monthlyOnly={monthlyOnly} kegs={kegs} distributors={distributors}/>            
            </Grid>
        </Grid>
    )
}

export default Shipping;