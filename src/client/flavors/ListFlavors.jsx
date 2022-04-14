import React, {useEffect, useState} from 'react'
import { getFlavors, isAdmin } from '../utils/api'
import FormatFlavors from './FormatFlavors';
import {AppBar, Divider, Grid, Typography, Alert, useMediaQuery} from '@mui/material'
import { useTheme } from "@mui/material/styles";
import { useHistory } from 'react-router-dom';

const ListFlavors = () => {

    const history = useHistory()
    const [flavors, setFlavors] = useState([]);
    const [error, setError] = useState(null)

    const theme = useTheme();
    const smallScreen = (!useMediaQuery(theme.breakpoints.up('sm')))

    useEffect(() => {
        const abortController = new AbortController()
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
        loadFlavors()
        return () => abortController.abort()
    }, [])

    return (
        <Grid container>
            <Grid item xs={12}>
                <Divider/>
                <AppBar position="static">
                    <Typography variant='h5' component='div' textAlign={smallScreen ? "center" : null} sx={{flexGrow: 1, pl: '10px', pb: '10px', pt: '10px'}}>
                        Flavors
                    </Typography>
                </AppBar>
                {error ? <Alert onClose={() => {setError(null)}} sx={{width: "30%", minWidth: "250px", margin: "auto", marginTop: "20px"}} variant="filled" severity="error">{error}</Alert>: null}
            </Grid>
            <Grid item xs={12}>
                <FormatFlavors flavors={flavors}/>
            </Grid>
        </Grid>
        
    )
}

export default ListFlavors;