import React, {useEffect, useState} from 'react'
import { getDistributors, isAdmin } from '../utils/api'
import FormatDistributors from './FormatDistributors';
import {AppBar, Divider, Grid, Typography, Alert, useMediaQuery} from '@mui/material'
import { useTheme } from "@mui/material/styles";
import { useHistory } from 'react-router-dom';

const ListDistributors = () => {

    const history = useHistory()
    const [dist, setDist] = useState([]);
    const [error, setError] = useState(null)

    const theme = useTheme();
    const smallScreen = (!useMediaQuery(theme.breakpoints.up('sm')))

    useEffect(() => {
        const abortController = new AbortController()
        const loadDistributors = async () => {
            await getDistributors(abortController.signal)
                .then(response => {
                    if (response.error) {
                        setError(response.error)
                    } else {
                        setDist(response)
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
                    }
                })
        }
        adminCheck()
        loadDistributors()
        return () => abortController.abort()
    }, [])

    return (
        <Grid container>
            <Grid item xs={12}>
                {error ? <Alert onClose={() => {setError(null)}} sx={{width: "30%", minWidth: "250px", margin: "auto", marginTop: "20px"}} variant="filled" severity="error">{error}</Alert>: null}
            </Grid>
            <Grid item xs={12}>
                <FormatDistributors distributors={dist}/>
            </Grid>
        </Grid>
        
    )
}

export default ListDistributors;