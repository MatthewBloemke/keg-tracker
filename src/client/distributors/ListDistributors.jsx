import React, {useEffect, useState} from 'react'
import { getDistributors } from '../utils/api'
import FormatDistributors from './FormatDistributors';
import {AppBar, Divider, Grid, Typography} from '@mui/material'

const ListDistributors = () => {
    const [dist, setDist] = useState([]);
    useEffect(() => {
        const abortController = new AbortController()
        const loadDistributors = async () => {
            await getDistributors(abortController.signal)
                .then(setDist)            
        }
        loadDistributors()
        return () => abortController.abort()
    }, [])

    return (
        <Grid container>
            <Grid item xs={12}>
                <Divider/>
                <AppBar position="static">
                    <Typography variant='h5' component='div' sx={{flexGrow: 1, pl: '10px', pb: '10px', pt: '10px'}}>
                        Distributors
                    </Typography>
                </AppBar>
            </Grid>
            <Grid item xs={12}>
                <FormatDistributors distributors={dist}/>
            </Grid>
        </Grid>
        
    )
}

export default ListDistributors;