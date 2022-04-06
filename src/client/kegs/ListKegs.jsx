import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getDistributors, getKegs } from '../utils/api'
import FormatKegs from './FormatKegs'
import {AppBar, Divider, Grid, Typography} from '@mui/material'
import "./ListKegs.css"

const ListKegs = () => {
    const params = useParams();
    const [kegs, setKegs] = useState([]);
    const [distributors, setDistributors] = useState([]);
    useEffect(() => {
        const returnedKegs = []
        const shippedKegs = []
        const abortController = new AbortController();
        getDistributors(abortController.signal)
            .then(setDistributors);
        console.log(params.status)
        getKegs(abortController.signal)
            .then(response => {
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
                    setKegs(shippedKegs);
                };
            });
    }, [params.status]);

    return (
        <Grid container>
            <Grid item xs={12}>
                <Divider/>
                <AppBar position='static'>
                    <Typography variant='h5' component='div' sx={{flexGrow: 1, pl: '10px', pb: '10px', pt: '10px'}}>
                        {params.status === "shipped" ? "Shipped Kegs" : "Returned Kegs"}
                    </Typography>
                </AppBar>
            </Grid>

            <Grid item xs={12}>
                <FormatKegs kegs={kegs} distributors={distributors} status={params.status}/> 
            </Grid>
        </Grid>
        
    );
};

export default ListKegs;