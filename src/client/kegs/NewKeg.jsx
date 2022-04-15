import React, { useEffect, useState } from "react"
import { createHistory, createKeg, getDistributors } from "../utils/api";
import { useMediaQuery, FormControl, TextField, Alert, Grid, Button, Select, MenuItem, InputLabel, Divider, AppBar, Typography} from '@mui/material'
import {LocalizationProvider, DatePicker, } from '@mui/lab'
import DateFnsUtils from '@mui/lab/AdapterDateFns'
import { useTheme } from "@mui/material/styles";

const NewKeg = () => {
    const user = localStorage.getItem('user')

    const initialFormState ={
        keg_name: "",
        keg_status: "returned",
        keg_size: "1/2 BBL",
        distributor_id: "",
        employee_email: user
    }

    const [formData, setFormData] = useState(initialFormState);
    const [date_shipped, setDate_shipped] = useState(new Date(Date.now()))
    const [distArr, setDistArr] = useState([]);
    const [error, setError] = useState(null)
    const [alert, setAlert] = useState(null)

    const theme = useTheme();
    const smallScreen = (!useMediaQuery(theme.breakpoints.up('sm')))

    useEffect(() => {
        const abortController = new AbortController()
        const loadDistributors = async () => {
            getDistributors(abortController.signal)
                .then(response => {
                    if (response.error) {
                        setError("Unable to load distributors")
                    } else {
                        const distOptions = []
                        const tempDist = response;
                        tempDist.sort((a, b) => {
                            return a.distributor_name.toLowerCase().localeCompare(b.distributor_name.toLowerCase());
                        })
                        tempDist.forEach(item => {
                            distOptions.push(
                                <MenuItem key={item.distributor_id} value={item.distributor_id}>{item.distributor_name}</MenuItem>
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
        date_shipped.setHours(0,0,0,0)
        const data = {
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
                setError(`${invalidFields[0]} is invalid`);
            } else {
                setError(`${invalidFields.join(", ")} are invalid`);
            }
        } else {
            await createKeg(data, controller.signal)
                .then(async (response) => {
                    if (response.error) {
                        setError(response.error);
                    } else if (formData.keg_status === "shipped") {
                        const shippingData = {
                            date_shipped,
                            keg_id: response.keg_id,
                            distributor_id: formData.distributor_id,
                            employee_email: user,
                            keg_status: "shipped"
                        }
                        await createHistory(shippingData)
                            .then(response => {
                                if (response.error) {
                                    setError(response.error)
                                } else {
                                    setAlert(`Keg ${formData.keg_name} successfully created`)
                                }
                            })
                    } else {
                        setAlert("Keg successfully created")
                    };
                });
            setFormData(initialFormState);
        };
    };
    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Grid container alignItems="center" direction="column">
                    <TextField sx={{width: "10%", minWidth:"250px", mb: "18px"}} id ="outlined-basic" label="Keg Number" name="keg_name" margin="normal" onChange={handleChange} value={formData.keg_name} />

                    <FormControl sx={{width: "10%", minWidth:"250px", mb: "18px"}}>
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

                    <FormControl sx={{width: "10%", minWidth:"250px", mb: "18px"}}>
                        <InputLabel>Keg Status</InputLabel>
                        <Select
                            value={formData.keg_status}
                            label='Keg Status'
                            name="keg_status"
                            onChange={handleChange}
                        >
                            <MenuItem value="returned">Returned</MenuItem>
                            <MenuItem value="shipped">Shipped</MenuItem>
                        </Select>                    
                    </FormControl>


                    <LocalizationProvider  dateAdapter={DateFnsUtils}>
                        <DatePicker
                            label="Date Shipped"
                            value={date_shipped}
                            name="date_shipped"
                            onChange={(newDate) => {
                                setDate_shipped(newDate);
                            }}
                            disabled={formData.keg_status === "returned" ? true : false}
                            renderInput={(params) => <TextField sx={{width: "10%", minWidth:"250px", mb: "18px"}} {...params} />}
                        />
                    </LocalizationProvider>

                    <FormControl sx={{width: "10%", minWidth:"250px", mb: "18px"}}>
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
                    <Button onClick={handleSubmit} size="large" variant="contained" >Submit</Button> <br/>
        
                </Grid>                
            </Grid>

            
            <Grid item xs={12} >
                <Grid container justifyContent="center" spacing={1}>
                    {error ? <Alert onClose={() => {setError(null)}} sx={{minWidth: "250px", width: "10%", margin: "auto", marginTop: "20px"}} variant="filled" severity="error">{error}</Alert>: null}
                    {alert ? <Alert onClose={() => {setAlert(null)}} sx={{minWidth: "250px", width: "10%", margin: "auto", marginTop: "20px"}} variant="filled" severity="success">{alert}</Alert>: null}
                </Grid>
            </Grid>
        </Grid>
    )
}

export default NewKeg;