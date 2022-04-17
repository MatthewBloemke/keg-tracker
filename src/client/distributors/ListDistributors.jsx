import React, {useEffect, useState} from 'react'
import { getDistributors, isAdmin, getKegs } from '../utils/api'
import FormatDistributors from './FormatDistributors';
import { Grid, Alert, useMediaQuery} from '@mui/material'
import { useHistory } from 'react-router-dom';

const ListDistributors = () => {

    const history = useHistory()
    const [dist, setDist] = useState([]);
    const [error, setError] = useState(null)
    const [kegs, setKegs] = useState([])


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
        const loadKegs = async () => {
            await getKegs(abortController.signal)
                .then(response => {
                    const tempKegs = [];
                    if (response.error) {
                        setError(response.error)
                    } else {
                        response.forEach(keg => {
                            if (keg.keg_status === "shipped") {
                                tempKegs.push(keg)
                            }
                        })
                        setKegs(tempKegs);
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
        loadKegs()
        return () => abortController.abort()
    }, [])
    return (
        <Grid container>
            <Grid item xs={12}>
                {error ? <Alert onClose={() => {setError(null)}} sx={{width: "30%", minWidth: "250px", margin: "auto", marginTop: "20px"}} variant="filled" severity="error">{error}</Alert>: null}
            </Grid>
            <Grid item xs={12}>
                <FormatDistributors distributors={dist} kegs={kegs}/>
            </Grid>
        </Grid>
        
    )
}

export default ListDistributors;