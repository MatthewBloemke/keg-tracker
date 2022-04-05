import React, { useEffect, useState } from 'react'
import { getEmployees} from '../utils/api';
import FormatEmployeesList from './FormatEmployeesList'
import {Grid} from '@mui/material'

const ListEmployees = () => {
    const [employees, setEmployees] = useState([]);
    useEffect(() => {
        const abortController = new AbortController();
        getEmployees(abortController.signal)
            .then(setEmployees)

        return () => abortController.abort();
    }, []);
    return (
        <Grid>
            <Grid item xs={12}>
                <h1 style={{paddingLeft: '10px'}}>Employees</h1>
            </Grid>
            <Grid item xs={12}>
                <FormatEmployeesList employees={employees}/>
            </Grid>
        </Grid>
        
    )
}

export default ListEmployees;