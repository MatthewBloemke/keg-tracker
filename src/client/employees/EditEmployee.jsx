import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { deleteEmployee, readEmployee, resetPassword, updateEmployee, isAdmin } from "../utils/api";
import { Grid, TextField, FormControl, Select, MenuItem, InputLabel, Alert, Button, Divider, AppBar, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";


const EditEmployee = () => {
    const user = localStorage.getItem("user")
    const params = useParams();
    const history = useHistory();

    const initialFormState = {
        employee_id: null,
        employee_name: "",
        employee_email: "",
        password: "",
        passwordMatch: "",
        admin: false,
    };

    const [formData, setFormData] = useState(initialFormState);
    const [error, setError] = useState(null);
    const [alert, setAlert] = useState(null);
    const [disabled, setDisabled] = useState(false);
    const [passwordDisabled, setPasswordDisabled] = useState(true)
    const [passwordError, setPasswordError] = useState(false)

    const handleChange = ({target}) => {
        setFormData({
            ...formData, 
            [target.name]: target.value
        })
    }

    const theme = useTheme();
    const smallScreen = (!useMediaQuery(theme.breakpoints.up('sm')))

    const handleSubmit = async (event) => {
        event.preventDefault();
        const abortController = new AbortController()
        const invalidFields = [];
        if (!formData.employee_email) invalidFields.push("Email");
        if (!formData.employee_name) invalidFields.push("Name");
        if (typeof formData.admin != "boolean") invalidFields.push("Admin")
        if (invalidFields.length) {
            setError(invalidFields.join(", ") + "are invalid")
        } else {
            const data = {
                employee_email: formData.employee_email,
                employee_name: formData.employee_name,
                admin: formData.admin
            };
            await updateEmployee(data, params.employeeId, abortController.signal)
                .then(response => {
                    if (response.error) {
                        setError(response.error)
                    } else {
                        localStorage.setItem("name", response.employee_name)
                        history.go(0)
                        setAlert("Employee Succesfully updated")
                    }
                });
            setFormData(initialFormState)
        }

    };

    const submitPassword = async (event) => {
        event.preventDefault();
        const data = {
            employee_email: formData.employee_email,
            employee_name: formData.employee_name,
            admin: formData.admin,
            password: formData.password
        }
        await resetPassword(data, params.employeeId)
            .then(response => {
                if (response.error) {
                    setError(response.error)
                } else {
                    setAlert("Password successfully updated")
                }
            })
        setFormData(initialFormState)
    }

    const onDelete = async () => {
        const confirm = window.prompt("Are you sure? Please type 'delete' to confirm")
        if (confirm === 'delete') {
            deleteEmployee(params.employeeId)
            .then(response => {
                if (response.status===200) {
                    window.alert("User successfully deleted")
                    history.push("/employees")
                } else {
                    window.alert("Action failed")
                }
            })
        }
        
    }

    useEffect(() => {
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

        const loadEmployee = async () => {
            await readEmployee(params.employeeId, abortController.signal)
                .then(response => {
                    if (response.error) {
                        setError(response.error)
                    } else {
                        if (user === response.employee_email) {
                            setDisabled(true)
                        };
                        setFormData({
                            ...formData,
                            employee_name: response.employee_name,
                            employee_email: response.employee_email,
                            admin: response.admin,
                            employee_id: params.employeeId
                        })                        
                    }
                })
        }
        if (params.employeeId != localStorage.getItem("id")) {
            adminCheck()            
        }
        
        
        if (formData.employee_id != params.employeeId) {
           loadEmployee() 
        }
        if (formData.password === formData.passwordMatch) {
            setPasswordDisabled(false)
            setPasswordError(false)
        } else {
            setPasswordError(true)
            setPasswordDisabled(true)
        }

        return () => abortController.abort()
    }, [params.employeeId, formData.password, formData.passwordMatch])

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Divider/>
                <AppBar position="static">
                    <Typography variant='h5' component='div' textAlign={smallScreen ? "center" : null} sx={{flexGrow: 1, pl: '10px', pb: '10px', pt: '10px'}}>
                        Edit Employee
                    </Typography>
                </AppBar>    
            </Grid>
                <Grid item xs={12} sm={6} md={6} lg={6}>
                    <Grid container textAlign='center' spacing={3}>
                        <Grid item xs={12}>
                            <TextField sx={{width: "10%", marginBottom: '15px', minWidth:'250px'}} className="outlined-basic" label="Name" name="employee_name" onChange={handleChange} value={formData.employee_name} /> <br/>
                            <TextField sx={{width: "10%", marginBottom: '15px', minWidth:'250px'}} className="outlined-basic" label="Username" name="employee_email" onChange={handleChange} value={formData.employee_email} /> <br/>
                            <FormControl sx={{width: '10%', minWidth:'250px'}}>
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
                        <Grid item xs={12}>
                            <Grid container justifyContent="space-evenly">
                                <Button disabled={disabled} onClick={onDelete} variant="contained" color="error">Delete User</Button>
                                <Button onClick={handleSubmit} variant="contained" >Submit</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                
                <Grid item xs={12} sm={6} md={6} lg={6}>
                    {smallScreen ? <Divider sx = {{mb: "15px"}}/> : null}
                    <Grid container textAlign='center' spacing={3}>
                        <Grid item xs={12}>
                            <TextField sx={{width: "10%", marginBottom: '15px', minWidth:'250px'}} className="outlined-basic" type="password" label="Password" name="password" onChange={handleChange} value={formData.password} /> <br/>
                            <TextField sx={{width: "10%", marginBottom: '15px', minWidth:'250px'}} className="outlined-basic" helperText={passwordError ? "Password do not match": null} error = {passwordError} type="password" label="Retype Password" name="passwordMatch" onChange={handleChange} value={formData.passwordMatch} /> <br/>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container justifyContent="center">
                                <Button onClick={submitPassword} variant="contained" disabled={passwordDisabled}>Reset Password</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            <Grid item xs={12}>
                {error ? <Alert onClose={() => {setError(null)}} sx={{width: "40%", margin: "auto", marginTop: "20px"}} variant="filled" severity="error">{error}</Alert>: null}
                {alert ? <Alert onClose={() => {setAlert(null)}} sx={{width: "40%", margin: "auto", marginTop: "20px"}} variant="filled" severity="success">{alert}</Alert>: null}
            </Grid>
        </Grid>
    )
}

export default EditEmployee;