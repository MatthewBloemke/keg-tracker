import React, {useState} from 'react'
import { createDistributor } from "../utils/api"
import {TextField, Alert, Grid, Button, Divider, AppBar, Typography} from "@mui/material"

const NewDistributor = () => {
    const initialFormState = {
        distributor_name: ""
    };

    const [formData, setFormData] = useState(initialFormState);
    const [disabled, setDisabled] = useState(true);
    const [error, setError] = useState(null);
    const [alert, setAlert] = useState(null);

    const handleChange = ({target}) => {
        if (target.value.length > 0) {
            setDisabled(false)
        } else {
            setDisabled(true)
        }
        setFormData({
            ...formData,
            [target.name]: target.value
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const controller = new AbortController();

        if (formData.distributor_name.length === 0) {
            setError("Please enter a name")
        } else {
            await createDistributor(formData, controller.signal)
                .then(response => {
                    if (response.error) {
                        setError(response.error)
                    } else {
                        setFormData(initialFormState)
                        setAlert("Distributor successfully created")                        
                    }
                });

        }
    }

    return (
        <Grid container textAlign='center' spacing={3}>
            <Grid item xs={12}>
                <Divider/>
                <AppBar position='static'>
                    <Typography variant='h5' component='div' sx={{flexGrow: 1, pl: '10px', pb: '10px', pt: '10px'}}>
                        New Distributor
                    </Typography>
                </AppBar>
            </Grid>
            <Grid item xs={12}>
                <TextField sx={{width: "10%", minWidth: "250px"}} id="outlined-basic" label="Distributor Name" name='distributor_name' onChange={handleChange} value={formData.distributor_name} />
            </Grid>
            <Grid item xs={12} >
                <Grid container  justifyContent="center" spacing={1}>
                    <Button onClick={handleSubmit} size="large" variant="contained" disabled={disabled}>Submit</Button> <br/>
                </Grid>
            </Grid>
            <Grid item xs={12} >
                <Grid container justifyContent="center" spacing={1}>
                    {error ? <Alert onClose={() => {setError(null)}} sx={{minWidth: "250px", width: "30%", margin: "auto", marginTop: "20px"}} variant="filled" severity="error">{error}</Alert>: null}
                    {alert ? <Alert onClose={() => {setAlert(null)}} sx={{minWidth: "250px", width: "30%", margin: "auto", marginTop: "20px"}} variant="filled" severity="success">{alert}</Alert>: null}
                </Grid>
            </Grid>
        </Grid>
    )
}

export default NewDistributor