import React, { useEffect, useState } from 'react'
import { getDistributors, getKegs, getShippingHistory } from '../utils/api'
import FormatShipping from './FormatShipping'
import DateFnsUtils from '@mui/lab/AdapterDateFns'
import {LocalizationProvider, DatePicker, } from '@mui/lab'

import {MenuItem, TextField, Alert, Grid} from '@mui/material'
//add component for checking how many kegs shipped during timeframe


const Shipping = ({monthlyOnly}) => {
    const [shipping, setShipping] = useState([])
    const [date, setDate] = useState(new Date(Date.now()))
    const [kegs, setKegs] = useState([]);
    const [distributors, setDistributors] = useState([]);    

    useEffect(() => {
        const abortController = new AbortController()
        const loadShippingHistory = async () => {
            await getShippingHistory(abortController.signal)
                .then(setShipping)
        }
        const loadKegs = async () => {
            await getKegs(abortController.signal)
                .then(setKegs)
        }
        const loadDistributors = async () => {
            await getDistributors(abortController.signal)
                .then(setDistributors)
        }
        loadShippingHistory()
        loadKegs()
        loadDistributors()
        return () => abortController.abort()
    }, [])

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                {monthlyOnly ? <h1 className="subHeader">Monthly</h1> : <h1 className="subHeader">Daily</h1>}
            </Grid>
            <Grid item xs={12} sx={{backgroundColor: 'white', padding: '40px', marginLeft: '24px' }}>
                {monthlyOnly ?
                    <LocalizationProvider dateAdapter={DateFnsUtils}>
                        <DatePicker
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
            <Grid item xs={12} sx={{backgroundColor: 'white', marginLeft: '24px'}}>
                <FormatShipping shippingList={shipping} date={date} monthlyOnly={monthlyOnly} kegs={kegs} distributors={distributors}/>            
            </Grid>
        </Grid>
    )
}

export default Shipping;