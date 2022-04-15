import React, { useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom";
import { editKeg, readKeg, isAdmin } from "../utils/api";
import {FormControl, TextField, Alert, Grid, Button, Select, MenuItem, InputLabel, Divider, AppBar, Typography} from '@mui/material'

const EditKeg = () => {
    const params = useParams()
    const history = useHistory()
    const user = localStorage.getItem('user')
    const initialFormState ={
        keg_name: "",
        keg_size: "1/2 BBL",
        keg_status: "returned",
        employee_email: user,
        distributor_id: null,
        date_shipped: null
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
        
        const loadKeg = async () => {
            await readKeg(params.kegId)
                .then(response => {
                    if (response.error) {
                        setError(response.error)
                    } else {
                        setFormData({
                            ...formData,
                            keg_name: response.keg_name,
                            keg_size: response.keg_size,
                            keg_status: response.keg_status,
                            distributor_id: (response.shipped_to ? response.shipped_to : null),
                            date_shipped: (response.date_shipped ? response.date_shipped : null)
                        })           
                    }
                })            
        }
        
        adminCheck()
        loadKeg()
        return () => abortController.abort()
    }, [params.kegId, error, alert])

    const [formData, setFormData] = useState(initialFormState);
    const [error, setError] = useState(null)
    const [alert, setAlert] = useState(null)

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
        if (!Number(formData.keg_name) || formData.keg_name.length != 4) {
            invalidFields.push("keg_name")
        }
        if (invalidFields.length) {
            if (invalidFields.length === 1) {
                setError(`${invalidFields[0]} is invalid`)
            } else {
                setError(`${invalidFields.join(", ")} are invalid`)
            }
        } else {
            await editKeg(formData, params.kegId, abortController.signal)
                .then(response => {
                    if (response.error) {
                        setError(response.error)
                    } else {
                        setAlert("Keg successfully updated")
                    }
                })
        }
    }
    return (
        <Grid container spacing={3} textAlign="center">
            <Grid item xs={12} sx={{ paddingTop: "12px"}}>
                <TextField sx={{width: "10%", minWidth:"250px"}} id ="outlined-basic" label="Keg Number" name="keg_name" margin="normal" onChange={handleChange} value={formData.keg_name} />
            </Grid>
            <Grid item xs={12}>
                <FormControl sx={{width: "10%", minWidth:"250px"}}>
                    <InputLabel>Keg Size</InputLabel>
                    <Select
                        value={formData.keg_size}
                        label="Keg Size"
                        name='keg_size'
                        onChange={handleChange}
                    >
                        <MenuItem value="1/2 BBL">1/2 BBL</MenuItem>
                        <MenuItem value="1/6 BBL">1/6 BBL</MenuItem>
                    </Select>                    
                </FormControl>
            </Grid>
            <Grid item xs={12} >
                <Grid container  justifyContent="center" spacing={1}>
                    <Button onClick={handleSubmit} size="large" variant="contained" >Submit</Button> <br/>
                </Grid>
            </Grid>
            <Grid item xs={12} >
                <Grid container  justifyContent="center" spacing={1}>
                    {error ? <Alert onClose={() => {setError(null)}} sx={{minWidth: "250px", width: "10%", margin: "auto", marginTop: "20px"}} variant="filled" severity="error">{error}</Alert>: null}
                    {alert ? <Alert onClose={() => {setAlert(null)}} sx={{minWidth: "250px", width: "10%", margin: "auto", marginTop: "20px"}} variant="filled" severity="success">{alert}</Alert>: null}
                </Grid>
            </Grid>
        </Grid>
    )
}

export default EditKeg;