import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getDistributors, getKegs } from '../utils/api'
import FormatKegs from './FormatKegs'
import {Grid} from '@mui/material'
import "./ListKegs.css"

//todo: add more comprehensive filter options

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
                <h2 style={{paddingLeft: "10px"}}>{params.status === "shipped" ? "Shipped Kegs" : "Returned Kegs"}</h2>
            </Grid>
            <Grid item xs={12}>
                <FormatKegs kegs={kegs} distributors={distributors} status={params.status}/> 
            </Grid>
        </Grid>
        
    );
};

export default ListKegs;