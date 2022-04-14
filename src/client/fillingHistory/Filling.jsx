import React, { useEffect, useState } from 'react'
import { getFlavors, getKegs, getFillingHistory, isAdmin } from '../utils/api'
import FormatFilling from './FormatFilling'
import DateFnsUtils from '@mui/lab/AdapterDateFns'
import {LocalizationProvider, DatePicker, } from '@mui/lab'
import {TextField, Grid, Divider, AppBar, Typography, useMediaQuery, Card, CardContent, CardActions, Button} from '@mui/material'
import { useTheme } from "@mui/material/styles";
import {makeStyles} from "@mui/styles"
import { Link, useHistory } from 'react-router-dom'

const Shipping = ({monthlyOnly}) => {
    const history = useHistory()
    const [filling, setFilling] = useState([])
    const [monthlyFilled, setMonthlyFilled] = useState([])
    const [date, setDate] = useState(new Date(Date.now()))
    const [kegs, setKegs] = useState([]);
    const [flavors, setFlavors] = useState([]);    
    const [error, setError] = useState(null)
    const theme = useTheme();
    const smallScreen = (!useMediaQuery(theme.breakpoints.up('sm')))
    date.setHours(0,0,0,0)
    const month = date.getUTCMonth()
    const year = date.getYear()

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
        const loadFillingHistory = async () => {
            await getFillingHistory(abortController.signal)
                .then(response => {
                    if (response.error) {
                        setError(response.error)
                    } else {
                        const fillingList = []
                        response.forEach(entry => {
                            const tempDate = new Date(entry.date_filled);
                            tempDate.setHours(0,0,0,0)
                            if (tempDate.getUTCMonth() === month && tempDate.getYear() === year) {
                                fillingList.push(entry)
                            }
                        })
                        setMonthlyFilled(fillingList)
                        setFilling(response)
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
        const loadFlavors = async () => {
            await getFlavors(abortController.signal)
                .then(response => {
                    if (response.error) {
                        setError(response.error)
                    } else {
                        setFlavors(response)
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
        loadFillingHistory()
        loadKegs()
        loadFlavors()
        return () => abortController.abort()
    }, [])

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Divider/>
                <AppBar position='static'>
                    <Typography variant='h5' component='div' textAlign={smallScreen ? "center": null} sx={{flexGrow: 1, pl: '10px', pb: '10px', pt: '10px'}}>
                        {monthlyOnly ? "Monthly Filling History": "Daily Filling History"}
                    </Typography>
                </AppBar>
                
            </Grid>
            <Grid container sx={{display: 'flex', flexDirection:"row", flexWrap: "wrap", justifyContent: "space-evenly"}}>
                <Card className={classes.root} variant="outlined">
                    <CardContent>
                        <Typography className={classes.title}>Number of Kegs Filled this month</Typography>
                        <Typography className={classes.pos}>{monthlyFilled.length} kegs have been filled this month</Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="medium" component={Link} to="/filling/monthly" >View filling history</Button>
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
                <FormatFilling fillingList={filling} date={date} monthlyOnly={monthlyOnly} kegs={kegs} flavors={flavors}/>            
            </Grid>
        </Grid>
    )
}

export default Shipping;