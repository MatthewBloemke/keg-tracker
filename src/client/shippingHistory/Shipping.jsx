import React, { useEffect, useState } from 'react'
import { getDistributors, getKegs, getShippingHistory } from '../utils/api'
import FormatShipping from './FormatShipping'
import DateFnsUtils from '@mui/lab/AdapterDateFns'
import {LocalizationProvider, DatePicker, } from '@mui/lab'
import {TextField, Grid, Divider, AppBar, Typography, useMediaQuery} from '@mui/material'
import { useTheme } from "@mui/material/styles";

const Shipping = ({monthlyOnly}) => {
    const [shipping, setShipping] = useState([])
    const [date, setDate] = useState(new Date(Date.now()))
    const [kegs, setKegs] = useState([]);
    const [distributors, setDistributors] = useState([]);    
    const [error, setError] = useState(null)
    const theme = useTheme();
    const smallScreen = (!useMediaQuery(theme.breakpoints.up('sm')))


    useEffect(() => {
        const abortController = new AbortController()
        const loadShippingHistory = async () => {
            await getShippingHistory(abortController.signal)
                .then(response => {
                    if (response.error) {
                        setError(response.error)
                    } else {
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
        loadShippingHistory()
        loadKegs()
        loadDistributors()
        return () => abortController.abort()
    }, [])

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Divider/>
                <AppBar position='static'>
                    <Typography variant='h5' component='div' textAlign={smallScreen ? "center": null} sx={{flexGrow: 1, pl: '10px', pb: '10px', pt: '10px'}}>
                        {monthlyOnly ? "Monthly": "Daily"}
                    </Typography>
                </AppBar>
                
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