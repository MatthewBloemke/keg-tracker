import React, { useEffect, useState } from 'react';
import { getEmployees, isAdmin} from '../utils/api';
import FormatEmployeesList from './FormatEmployeesList';
import {Grid, Alert} from '@mui/material';
import { useHistory } from 'react-router-dom';


const ListEmployees = () => {
    const [employees, setEmployees] = useState([]);
    const [error, setError] = useState(null);

    const history = useHistory();

    useEffect(() => {
        const abortController = new AbortController();

        const adminCheck = async () => {
            await isAdmin(abortController.signal)
                .then(response => {
                    if (!response) {
                        history.push('/kegs/track/environment');
                        return () => {
                            abortController.abort();
                        };
                    };
                });
        };
        adminCheck();
        getEmployees(abortController.signal)
            .then(response => {
                if (response.error) {
                    setError(response.error);
                } else {
                    setEmployees(response);
                };
            });

        return () => abortController.abort();
    }, []);

    return (
        <Grid>
            <Grid item xs={12}>
                {error ? <Alert onClose={() => {setError(null)}} sx={{width: "30%", minWidth: "250px", margin: "auto", marginTop: "20px"}} variant="filled" severity="error">{error}</Alert>: null}
            </Grid>
            <Grid item xs={12}>
                <FormatEmployeesList employees={employees}/>
            </Grid>
        </Grid>
    );
};

export default ListEmployees;