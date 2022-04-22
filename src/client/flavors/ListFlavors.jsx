import React, {useEffect, useState} from 'react';
import { getFlavors, isAdmin } from '../utils/api';
import FormatFlavors from './FormatFlavors';
import { Grid, Alert } from '@mui/material';
import { useHistory } from 'react-router-dom';

const ListFlavors = () => {

    const history = useHistory();

    const [flavors, setFlavors] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const abortController = new AbortController();

        const loadFlavors = async () => {
            await getFlavors(abortController.signal)
                .then(response => {
                    if (response.error) {
                        setError(response.error);
                    } else {
                        setFlavors(response);
                    };
                });       
        };

        const adminCheck = async () => {
            await isAdmin(abortController.signal)
                .then(response => {
                    if (!response) {
                        history.push('/kegs/track');
                        return () => {
                            abortController.abort();
                        };
                    };
                });
        };

        adminCheck();
        loadFlavors();

        return () => abortController.abort();
    }, []);

    return (
        <Grid container>
            <Grid item xs={12}>
                {error ? <Alert onClose={() => {setError(null)}} sx={{width: "30%", minWidth: "250px", margin: "auto", marginTop: "20px"}} variant="filled" severity="error">{error}</Alert>: null}
            </Grid>
            <Grid item xs={12}>
                <FormatFlavors flavors={flavors}/>
            </Grid>
        </Grid>
    );
};

export default ListFlavors;