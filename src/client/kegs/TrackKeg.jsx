import React, { useEffect, useState } from 'react'
import { createHistory, trackKeg, getDistributors, verifyKeg } from '../utils/api';
import FormatKegIdList from './FormatKegIdList';
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel';
import {MenuItem, TextField, Alert, Button, Grid} from '@mui/material'
import Select from '@mui/material/Select';
import {LocalizationProvider, DatePicker, } from '@mui/lab'
import DateFnsUtils from '@mui/lab/AdapterDateFns'
import "./TrackKeg.css"

const TrackKeg = () => {
    const initialFormState = {
        keg_id: [],
        employee_email: localStorage.getItem('user'),
        keg_status: "shipped",
    }

    const [keg_names, setKeg_names] = useState([]);
    const [distArr, setDistArr] = useState([]);
    const [dist, setDist] = useState("")
    const [date_shipped, setDate_shipped] = useState(new Date(Date.now()))
    const [formData, setFormData] = useState(initialFormState);
    const [kegName, setKegName] = useState("");
    const [alert, setAlert] = useState(null)
    const [error, setError] = useState(null)
    const handleDistChange = (event) => {
        setDist(event.target.value)
    }

    const handleKegChange = async ({target}) => {
        setKegName(target.value)
        if (target.value.length===4) {
            if (keg_names.includes(target.value)) {
                setError(`Keg ${target.value} has already been added`)
                setKegName("")
            } else {
                await verifyKeg({keg_name: target.value})
                    .then(response => {
                        let timeA = new Date(response.date_shipped);
                        let timeB = new Date(date_shipped);
                        timeA.setHours(0,0,0,0)
                        timeB.setHours(0,0,0,0)
                        let timeDifference = timeB.getTime() - timeA.getTime()
                        if (response.error) {
                            setError(response.error)
                        } else if (response.keg_status === "shipped") {
                            setError(`Keg ${response.keg_name} is already shipped.`)
                        } else if (timeDifference < 0) {
                            setError(`Keg cannot be shipped before latest return date of ${timeA}`)
                        } else {
                            setKeg_names([...keg_names, target.value])
                            setFormData({
                                ...formData,
                                keg_id: [...formData.keg_id, response.keg_id]
                            })                            
                        }
                        

                    })
                setKegName("")                
            }
            
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        const abortController = new AbortController()
        date_shipped.setHours(0,0,0,0)
        formData.keg_id.forEach( async keg_id => {
            const data = {
                date_shipped: date_shipped,
                keg_id,
                distributor_id: dist,
                employee_email: formData.employee_email,
                keg_status: "shipped"
            }
            
            await createHistory(data)
            await trackKeg(data, keg_id, abortController.signal)
                .then(response => {
                    if (response.error) {
                        setError(response.error)
                    } else {
                        setAlert("Kegs successfully shipped!")
                    }
                })
            setFormData(initialFormState)
            setKeg_names([])
        })
    }

    const onDelete = (e) => {
        const index = keg_names.indexOf(e.currentTarget.name)
        let tempNameArr = keg_names;
        let tempIdArr = formData.keg_id;
        tempNameArr.splice(index, 1);
        tempIdArr.splice(index, 1)
        setKeg_names([...tempNameArr])
        setFormData({
            ...formData,
            keg_id: [...tempIdArr]
        })
    }

    useEffect(() => {
        const abortController = new AbortController()
        const loadDistributors = () => {
            getDistributors(abortController.signal)
                .then(response => {
                    const distOptions = []
                    response.forEach(item => {
                        distOptions.push(
                            <MenuItem sx={{ color: "#004a9f"}} key={item.distributor_id} value={item.distributor_id}>{item.distributor_name}</MenuItem>
                        )      
                    })
                    setDistArr(distOptions)
                })            
        }
        loadDistributors()
        return () => abortController.abort()
    }, [])

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <h2 id='trackKegs' className='subHeader'>Track Kegs</h2>
            </Grid>
            <Grid item xs={6}>
                <Grid container direction="row" justifyContent="center">
                    <Grid item xs={6}>
                        <Grid container justifyContent="center">
                            <h4 style={{marginTop: "20px", marginBottom:"40px"}}>Choose a Distributor to Ship to</h4>
                            <FormControl sx={{width: "50%"}}>
                                <InputLabel>Distributor</InputLabel>
                                <Select
                                    value={dist}
                                    label="Distributor"
                                    name="distributor_id"
                                    onChange={handleDistChange}
                                >
                                {distArr}
                                </Select>                                        
                            </FormControl>                            
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <Grid container justifyContent="center">
                            <TextField sx={{marginBottom: '15px'}}  id ="outlined-basic" label="Keg Id" name="keg_name" margin="normal" onChange={handleKegChange} value={kegName} disabled={dist ? false : true}/> <br/>
                            <FormControl sx={{width: "50%", marginBottom: "30px"}}>
                                <LocalizationProvider dateAdapter={DateFnsUtils}>
                                    <DatePicker
                                        label="Date Shipped"
                                        value={date_shipped}
                                        name="date_shipped"
                                        onChange={(newDate) => {
                                            setDate_shipped(newDate);
                                        }}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </LocalizationProvider>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container justifyContent="center">
                            <h5 style={{marginBottom: '20px'}}>Kegs Shipped: {keg_names.length}</h5> <br/>                       
                        </Grid>
                        <Grid container justifyContent="center">
                            <Button onClick={handleSubmit} size="large" variant="contained" color="success">Submit</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={6} >
                <Grid container direction="row">
                    <FormatKegIdList kegIds={keg_names} onDelete={onDelete}/>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container justifyContent="center" spacing={1}>
                    {error ? <Alert onClose={() => {setError(null)}} sx={{width: "40%", margin: "auto", marginTop: "20px"}} variant="filled" severity="error">{error}</Alert>: null}
                    {alert ? <Alert onClose={() => {setAlert(null)}} sx={{width: "40%", margin: "auto", marginTop: "20px"}} variant="filled" severity="success">{alert}</Alert>: null}
                </Grid>
            </Grid>
        </Grid>
    )
}

export default TrackKeg;