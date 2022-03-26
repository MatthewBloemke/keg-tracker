import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { editKeg, readKeg } from "../utils/api";
import {FormControl, TextField, Alert, Grid, Button, Select, MenuItem, InputLabel} from '@mui/material'
import "./NewKeg.css"

const EditKeg = () => {
    const params = useParams()
    const user = localStorage.getItem('user')
    const initialFormState ={
        keg_name: "",
        keg_size: "large",
        keg_status: "returned",
        employee_email: user,
        distributor_id: null,
        date_shipped: null
    }

    useEffect(() => {
        const abortController = new AbortController();
        const loadKeg = async () => {
            await readKeg(params.kegId)
                .then(response => {
                    console.log(response)
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
        console.log(formData)
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
        <Grid container spacing={3}>
            <Grid item xs={12} >
                <h1 className="subHeader">Edit Keg</h1>
            </Grid>
            <Grid item xs={6}>
                <Grid container justifyContent="flex-end">
                    <h5 style={{marginTop: "30px"}}>Keg Number</h5>
                </Grid>
            </Grid>
            <Grid item xs={6} sx={{ paddingTop: "12px"}}>
                <TextField sx={{width: "40%"}} id ="outlined-basic" label="Keg Number" name="keg_name" margin="normal" onChange={handleChange} value={formData.keg_name} />
            </Grid>
            <Grid item xs={6}>
                <Grid container justifyContent="flex-end">
                    <h5 style={{marginTop: "14px"}}>Keg Size</h5>
                </Grid>
            </Grid>
            <Grid item xs={6}>
                <FormControl sx={{width: "40%"}}>
                    <InputLabel>Keg Size</InputLabel>
                    <Select
                        value={formData.keg_size}
                        label="Keg Size"
                        name='keg_size'
                        onChange={handleChange}
                    >
                        <MenuItem sx={{ color: "#004a9f"}} value="1/2 BBL">1/2 BBL</MenuItem>
                        <MenuItem sx={{ color: "#004a9f"}} value="1/6 BBL">1/6 BBL</MenuItem>
                    </Select>                    
                </FormControl>
            </Grid>
            <Grid item xs={12} >
                <Grid container  justifyContent="center" spacing={1}>
                    <Button onClick={handleSubmit} size="large" variant="contained" color="success">Submit</Button> <br/>
                </Grid>
            </Grid>
            <Grid item xs={12} >
                <Grid container  justifyContent="center" spacing={1}>
                    {error ? <Alert onClose={() => {setError(null)}} sx={{width: "40%", margin: "auto", marginTop: "20px"}} variant="filled" severity="error">{error}</Alert>: null}
                    {alert ? <Alert onClose={() => {setAlert(null)}} sx={{width: "40%", margin: "auto", marginTop: "20px"}} variant="filled" severity="success">{alert}</Alert>: null}
                </Grid>
            </Grid>
        </Grid>
    )
}

export default EditKeg;