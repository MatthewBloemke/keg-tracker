import React, {useEffect, useState} from 'react'
import { getDistributors } from '../utils/api'
import FormatDistributors from './FormatDistributors';
import {Grid} from '@mui/material'

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
        <Grid>
            <Grid item xs={12}>
                <h1 style={{paddingLeft: '10px'}}>Distributors</h1>
            </Grid>
            <Grid item xs={12}>
                <FormatDistributors distributors={dist}/>
            </Grid>
        </Grid>
        
    )
}

export default ListDistributors;