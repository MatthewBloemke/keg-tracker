import React, { useEffect, useState } from 'react'
import { getEmployees, isAdmin} from '../utils/api';
import FormatEmployeesList from './FormatEmployeesList'
import {AppBar, Divider, Grid, Typography, useMediaQuery} from '@mui/material'
import { useTheme } from "@mui/material/styles";
import { useHistory } from 'react-router-dom';


const ListEmployees = () => {
    const [employees, setEmployees] = useState([]);
    const theme = useTheme();
    const history = useHistory()
    const smallScreen = (!useMediaQuery(theme.breakpoints.up('sm')))

    useEffect(() => {
        const abortController = new AbortController();
        const adminCheck = async () => {
            await isAdmin(abortController.signal)
                .then(response => {
                    if (!response) {
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