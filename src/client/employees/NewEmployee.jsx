import React, { useEffect, useState } from "react";
import { createEmployee } from "../utils/api";
import { Grid, TextField, FormControl, Select, MenuItem, InputLabel, Alert, Button, Stack } from "@mui/material";

//prevent creation of user with duplicate username

const NewEmployee = () => {
    const initialFormState = {
        employee_name: "",
        employee_email: "",
        password: "",
        passwordMatch: "",
        admin: false,
    };

    const [formData, setFormData] = useState(initialFormState);
    const [disabled, setDisabled] = useState(true);
    const [error, setError] = useState(null);
    const [alert, setAlert] = useState(null);
    const [passwordError, setPasswordError] = useState(false)

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
            console.log(data)
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
                <h1 style={{paddingLeft: '10px'}}>Create New Employee</h1>
            </Grid>
            <Grid item xs={6}>
                <Stack alignItems="end">
                    <h5 style={{marginRight: "20px", marginTop: '15px'}}>Name</h5>
                    <h5 style={{marginRight: "20px", marginTop: '38px'}}>Username</h5>
                    <h5 style={{marginRight: "20px", marginTop: '38px'}}>Password</h5>
                    <h5 style={{marginRight: "20px", marginTop: '38px'}}>Retype Password</h5>
                    <h5 style={{marginRight: "20px", marginTop: '38px'}}>Admin?</h5>
                </Stack>
            </Grid>
            <Grid item xs={6}>
                    <TextField sx={{width: "40%", marginBottom: '15px'}} id="outlined-basic" label="Name" name="employee_name" onChange={handleChange} value={formData.employee_name} /> <br/>
                    <TextField sx={{width: "40%", marginBottom: '15px'}} id="outlined-basic" label="Username" name="employee_email" onChange={handleChange} value={formData.employee_email} /> <br/>
                    <TextField sx={{width: "40%", marginBottom: '15px'}} id="outlined-basic" type="password" label="Password" name="password" onChange={handleChange} value={formData.password} /> <br/>
                    <TextField sx={{width: "40%", marginBottom: '15px'}} id="outlined-basic" helperText={passwordError ? "Password do not match": null} error = {passwordError} type="password" label="Retype Password" name="passwordMatch" onChange={handleChange} value={formData.passwordMatch} /> <br/>
                    <FormControl>
                        <InputLabel>Admin</InputLabel>
                        <Select
                            value={formData.admin}
                            label="Admin"
                            name="admin"
                            onChange={handleChange}
                        >
                            <MenuItem sx={{ color: "#004a9f"}} value={true}>True</MenuItem>
                            <MenuItem sx={{ color: "#004a9f"}} value={false}>False</MenuItem>
                        </Select>
                    </FormControl>
            </Grid>
            <Grid item xs={12} >
                <Grid container  justifyContent="center" spacing={1}>
                    <Button onClick={handleSubmit} size="large" variant="contained" disabled={disabled} color="success">Submit</Button> <br/>
                </Grid>
            </Grid>
            <Grid item xs={12} >
                <Grid container justifyContent="center" spacing={1}>
                    {error ? <Alert onClose={() => {setError(null)}} sx={{width: "40%", margin: "auto", marginTop: "20px"}} variant="filled" severity="error">{error}</Alert>: null}
                    {alert ? <Alert onClose={() => {setAlert(null)}} sx={{width: "40%", margin: "auto", marginTop: "20px"}} variant="filled" severity="success">{alert}</Alert>: null}
                </Grid>
            </Grid>
        </Grid>
    )
}

export default NewEmployee;