import React, { useEffect, useState } from 'react'
import { useParams, useLocation, useHistory } from 'react-router-dom'
import { getDistributors, getKegs, isAdmin } from '../utils/api'
import FormatShippedKegs from './FormatShippedKegs'
import {AppBar, Divider, Grid, Typography, useMediaQuery, Alert} from '@mui/material'
import { useTheme } from "@mui/material/styles";
import FormatReturnedKegs from './FormatReturnedKegs'

const ListKegs = () => {
    const location = useLocation()
    const history = useHistory()
    const overdueKegs = location.state;
    const params = useParams();
    const [kegs, setKegs] = useState([]);
    const [distributors, setDistributors] = useState([]);
    const [error, setError] = useState(null)
    const theme = useTheme();
    const smallScreen = (!useMediaQuery(theme.breakpoints.up('sm')))

    useEffect(() => {
        const returnedKegs = []
        const shippedKegs = []
        const abortController = new AbortController();
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
        getDistributors(abortController.signal)
            .then(response => {
                if (response.error) {
                    setError(response.error)
                } else {
                    setDistributors(response)
                }
            });
        getKegs(abortController.signal)
            .then(response => {
                if (response.error) {
                    setError(response.error)
                } else {
                    response.forEach(keg => {
                        if (keg.keg_status === "returned") {
                            returnedKegs.push(keg);
                        } else if (keg.keg_status === "shipped") {
                            shippedKegs.push(keg);
                        };
                    });
                    if (params.status === "returned") {
                        setKegs(returnedKegs); 
                    } else {
                        if (location.state) {
                            setKegs(overdueKegs)
                            history.replace({path: "/kegs/list/shipped", state: null})
                        } else {
                            setKegs(shippedKegs);
                        }

                    };                    
                }

            });
    }, [params.status]);

    return (
        <Grid container alignItems="center">
            <Grid item xs={12}>
                {error ? <Alert onClose={() => {setError(null)}} sx={{width: "40%", margin: "auto", marginTop: "20px"}} variant="filled" severity="error">{error}</Alert>: null}
                {params.status === "shipped" ? <FormatShippedKegs kegs={kegs} distributors={distributors} status={params.status}/> : <FormatReturnedKegs kegs={kegs}/> }
            </Grid>
        </Grid>
        
    );
};

export default ListKegs;