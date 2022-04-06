import React, { useEffect, useState } from 'react'
import { getEmployees} from '../utils/api';
import FormatEmployeesList from './FormatEmployeesList'
import {AppBar, Divider, Grid, Typography, useMediaQuery} from '@mui/material'
import { useTheme } from "@mui/material/styles";


const ListEmployees = () => {
    const [employees, setEmployees] = useState([]);
    const theme = useTheme();
    const smallScreen = (!useMediaQuery(theme.breakpoints.up('sm')))

    useEffect(() => {
        const abortController = new AbortController();
        getEmployees(abortController.signal)
            .then(setEmployees)

        return () => abortController.abort();
    }, []);
    return (
        <Grid>
            <Grid item xs={12}>
                <Divider/>
                <AppBar position='static'>
                    <Typography variant='h5' component='div' textAlign={smallScreen ? "center" : null} sx={{flexGrow: 1, pl: '10px', pb: '10px', pt: '10px'}}>
                        Employees
                    </Typography>
                </AppBar>
            </Grid>
            <Grid item xs={12}>
                <FormatEmployeesList employees={employees}/>
            </Grid>
        </Grid>
        
    )
}

export default ListEmployees;