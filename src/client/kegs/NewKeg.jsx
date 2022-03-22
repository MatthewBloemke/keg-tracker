import React, { useEffect, useState } from "react"
import { createKeg, getDistributors } from "../utils/api";
import {FormControl, TextField, Alert, Grid, Button, Select, MenuItem, InputLabel} from '@mui/material'
import {LocalizationProvider, DatePicker, } from '@mui/lab'
import DateFnsUtils from '@mui/lab/AdapterDateFns'
import "./NewKeg.css"

const NewKeg = () => {
    const user = localStorage.getItem('user')
    const date = new Date()
    const month = String(date.getMonth() + 1)
    const day = String(date.getDate())

    const initialFormState ={
        keg_name: "",
        keg_status: "returned",
        keg_size: "1/2 BBL",
        distributor_id: "",
        employee_email: user
    }
    const initialDate = `${date.getFullYear()}-${("0"+month).slice(-2)}-${("0"+day).slice(-2)}`

    const [formData, setFormData] = useState(initialFormState);
    const [date_shipped, setDate_shipped] = useState(initialDate)
    const [distArr, setDistArr] = useState([]);
    const [error, setError] = useState(null)
    const [alert, setAlert] = useState(null)

    useEffect(() => {
        const abortController = new AbortController()
        const loadDistributors = async () => {
            getDistributors(abortController.signal)
                .then(response => {
                    if (response.error) {
                        setError("Unable to load distributors")
                    } else {
                        const distOptions = []
                        response.forEach(item => {
                            distOptions.push(
                                <MenuItem sx={{ color: "#004a9f"}} key={item.distributor_id} value={item.distributor_id}>{item.distributor_name}</MenuItem>
                            )      
                        })
                        setDistArr(distOptions)                        
                    }

                })
        }
        loadDistributors()
        return () => abortController.abort()
    }, [])

    const handleChange = ({target}) => {
        setFormData({
            ...formData, 
            [target.name]: target.value
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const controller = new AbortController();
        console.log(formData)
        const data ={
            keg_name: formData.keg_name,
            keg_status: formData.keg_status,
            keg_size: formData.keg_size,
            date_shipped: date_shipped,
            distributor_id: formData.distributor_id,
            employee_email: user
        }
        if (data.keg_status === "returned") {
            data.date_shipped=null;
            data.distributor_id=null;
        }
        const invalidFields = [];
        if (!Number(data.keg_name) || data.keg_name.length != 4) {
            invalidFields.push("keg_name")
        }
        if (data.keg_status === "shipped" && !data.date_shipped) {
            invalidFields.push("date_shipped")
        }
        if (data.keg_status === "shipped" && !data.distributor_id) {
            invalidFields.push("distributor_id")
        }
        if (invalidFields.length) {
            if (invalidFields.length === 1) {
                setError(`${invalidFields[0]} is invalid`)
            } else {
                setError(`${invalidFields.join(", ")} are invalid`)
            }
        } else {
            await createKeg(data, controller.signal)
                .then(response => {
                    console.log(response)
                    if (response.error) {
                        console.log("error")
                        setError(response.error)
                    } else {
                        setAlert("Keg successfully created")
                    }
                })
            setFormData(initialFormState)
        }
    }
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} >
                <h1>Create New Keg</h1>
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
            <Grid item xs={6}>
                <Grid container justifyContent="flex-end">
                    <h5 style={{marginTop: "14px"}}>Keg Status</h5>
                </Grid>
            </Grid>
            <Grid item xs={6}>
                <FormControl sx={{width: "40%"}}>
                    <InputLabel>Keg Status</InputLabel>
                    <Select
                        value={formData.keg_status}
                        label='Keg Status'
                        name="keg_status"
                        onChange={handleChange}
                    >
                        <MenuItem sx={{ color: "#004a9f"}} value="returned">Returned</MenuItem>
                        <MenuItem sx={{ color: "#004a9f"}} value="shipped">Shipped</MenuItem>
                    </Select>                    
                </FormControl>

            </Grid>
            <Grid item xs={6}>
                <Grid container justifyContent="flex-end">
                    <h5 style={{marginTop: "14px"}}>Date Shipped</h5>
                </Grid>
            </Grid>
            <Grid item xs={6}>
                <LocalizationProvider  dateAdapter={DateFnsUtils}>
                    <DatePicker
                    
                        label="Date Shipped"
                        value={date_shipped}
                        name="date_shipped"
                        onChange={(newDate) => {
                            setDate_shipped(newDate);
                        }}
                        disabled={formData.keg_status === "returned" ? true : false}
                        renderInput={(params) => <TextField sx={{width: "40%"}} {...params} />}
                    />
                </LocalizationProvider>
            </Grid>
            <Grid item xs={6}>
                <Grid container justifyContent="flex-end">
                    <h5 style={{marginTop: "14px"}}>Distributor</h5>
                </Grid>
            </Grid>
            <Grid item xs={6}>
                <FormControl sx={{width: "40%",}}>
                    <InputLabel>Distributor</InputLabel>
                    <Select
                        value={formData.distributor_id}
                        label="Distributor"
                        name="distributor_id"
                        onChange={handleChange}
                        disabled={formData.keg_status === "returned" ? true : false}
                    >
                        {distArr}
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

export default NewKeg;