import React, {useState} from 'react'
import { createDistributor } from "../utils/api"
import {TextField, Alert, Grid, Button} from "@mui/material"


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
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <h1 style={{paddingLeft: '10px'}}>Create New Distributor</h1>
            </Grid>
            <Grid item xs={6}>
                <Grid container justifyContent='flex-end'>
                    <h5 style={{marginTop: '15px'}}>Distributor Name</h5>
                </Grid>
            </Grid>
            <Grid item xs={6}>
                <TextField sx={{width: "40%"}} id="outlined-basic" label="Distributor Name" name='distributor_name' onChange={handleChange} value={formData.distributor_name} />
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

export default NewDistributor