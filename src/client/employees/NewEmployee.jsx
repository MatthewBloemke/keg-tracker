import React, { useEffect, useState } from "react";
import { createEmployee, isAdmin } from "../utils/api";
import { Grid, TextField, FormControl, Select, useMediaQuery, MenuItem, InputLabel, Alert, Button, Stack, Divider, AppBar, Typography } from "@mui/material";
import {useTheme} from '@mui/material/styles'
import { useHistory } from "react-router-dom";

const NewEmployee = () => {
    const initialFormState = {
        employee_name: "",
        employee_email: "",
        password: "",
        passwordMatch: "",
        admin: false,
    };

    const history = useHistory()
    const [formData, setFormData] = useState(initialFormState);
    const [disabled, setDisabled] = useState(true);
    const [error, setError] = useState(null);
    const [alert, setAlert] = useState(null);
    const [passwordError, setPasswordError] = useState(false)

    const theme = useTheme();
    const smallScreen = (!useMediaQuery(theme.breakpoints.up('sm')))


    const handleChange = ({target}) => {
        setFormData({
            ...formData, 
            [target.name]: target.value
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const abortController = new AbortController();

        const invalidFields = [];
        if (!formData.employee_email) invalidFields.push("Email");
        if (!formData.employee_name) invalidFields.push("Name");
        if (formData.password != formData.passwordMatch) invalidFields.push("Password");
        if (typeof formData.admin != "boolean") invalidFields.push("Admin")
        if (invalidFields.length) {
            setError(invalidFields.join(", ") + "are invalid")
        } else {
            const data = {
                employee_email: formData.employee_email,
                employee_name: formData.employee_name,
                password: formData.password,
                admin: formData.admin
            };
            await createEmployee(data, abortController.signal)
                .then(response => {
                    if (response.error) {
                        setError(response.error)
                    } else {
                        setAlert("Employee Successfully created")
                    }
                });
            setFormData(initialFormState)
        }
    };

    useEffect(() => {
        const abortController = new AbortController()

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

        if (formData.employee_name && formData.employee_email && formData.password === formData.passwordMatch && formData.password) {
            setDisabled(false)
        } else {
            setDisabled(true)
        }
        if (formData.passwordMatch != formData.password) {
            setPasswordError(true)
        } else {
            setPasswordError(false)
        }
    }, [formData.employee_email, formData.employee_name, formData.password, formData.passwordMatch])
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Divider/>
                <AppBar position='static'>
                    <Typography variant='h5' component='div' textAlign={smallScreen ? "center" : null} sx={{flexGrow: 1, pl: '10px', pb: '10px', pt: '10px'}}>
                        Create Employee
                    </Typography>
                </AppBar>
            </Grid>
            <Grid item xs={12}>
                <Grid container textAlign="center">
                    <Grid item xs={12}>
                        <TextField sx={{width: "10%", minWidth: "250px", marginBottom: '15px', mb: "25px"}} id="outlined-basic" label="Name" name="employee_name" onChange={handleChange} value={formData.employee_name} /> <br/>
                        <TextField sx={{width: "10%", minWidth: "250px", marginBottom: '15px', mb: "25px"}} id="outlined-basic" label="Username" name="employee_email" onChange={handleChange} value={formData.employee_email} /> <br/>
                        <TextField sx={{width: "10%", minWidth: "250px", marginBottom: '15px', mb: "25px"}} id="outlined-basic" type="password" label="Password" name="password" onChange={handleChange} value={formData.password} /> <br/>
                        <TextField sx={{width: "10%", minWidth: "250px", marginBottom: '15px', mb: "25px"}} id="outlined-basic" helperText={passwordError ? "Password do not match": null} error = {passwordError} type="password" label="Retype Password" name="passwordMatch" onChange={handleChange} value={formData.passwordMatch} /> <br/>
                        <FormControl sx={{width: "10%", minWidth: "250px",}}>
                            <InputLabel>Admin</InputLabel>
                            <Select
                                value={formData.admin}
                                label="Admin"
                                name="admin"
                                onChange={handleChange}
                            >
                                <MenuItem value={true}>True</MenuItem>
                                <MenuItem value={false}>False</MenuItem>
                            </Select>
                        </FormControl>  
                    </Grid>
                  
                </Grid>

            </Grid>
            <Grid item xs={12} >
                <Grid container  justifyContent="center" spacing={1}>
                    <Button sx={{mt:"15px"}} onClick={handleSubmit} size="large" variant="contained" disabled={disabled}>Submit</Button> <br/>
                </Grid>
            </Grid>
            <Grid item xs={12} >
                <Grid container justifyContent="center" spacing={1}>
                    {error ? <Alert onClose={() => {setError(null)}} sx={{width: "30%", minWidth: "250px", margin: "auto", marginTop: "20px"}} variant="filled" severity="error">{error}</Alert>: null}
                    {alert ? <Alert onClose={() => {setAlert(null)}} sx={{width: "30%", minWidth: "250px", margin: "auto", marginTop: "20px"}} variant="filled" severity="success">{alert}</Alert>: null}
                </Grid>
            </Grid>
        </Grid>
    )
}

export default NewEmployee;