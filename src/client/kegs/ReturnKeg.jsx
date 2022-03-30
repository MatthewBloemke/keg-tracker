import React, { useState } from 'react'
import { createHistory, trackKeg, verifyKeg } from '../utils/api';
import FormatKegIdList from './FormatKegIdList';
import {FormControl, TextField, Alert, Grid, Button} from '@mui/material'
import {LocalizationProvider, DatePicker, } from '@mui/lab'
import DateFnsUtils from '@mui/lab/AdapterDateFns'

const ReturnKeg = () => {
    const date = new Date()
    const month = String(date.getMonth() + 1)
    const day = String(date.getDate())
    const initialFormState = {
        keg_id: [],
        keg_status: "returned",
        shipped_to: null,
        employee_email: localStorage.getItem('user')
    }


    const [keg_names, setKeg_names] = useState([])
    const [formData, setFormData] = useState(initialFormState);
    const [kegName, setKegName] = useState("")
    const [alert, setAlert] = useState(null)
    const [error, setError] = useState(null)
    const [date_shipped, setDate_shipped] = useState(new Date(Date.now()))

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
                        } else if (response.keg_status === "returned") {
                            setError(`Keg ${response.keg_name} has already been returned`)
                        } else if (timeDifference < 0) {
                            setError(`Returned date cannot be before the Keg's shipped date of ${timeA}`)
                        } else {
                            setKeg_names([...keg_names, target.value])
                            setFormData({
                                ...formData,
                                keg_id: [...formData.keg_id, response.keg_id]
                            })                             
                        }

                    })
                    .catch(err => {
                        console.log(err)
                    })
                setKegName("")     
            }
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        console.log(formData)
        date_shipped.setHours(0,0,0,0)
        const abortController = new AbortController()
        formData.keg_id.forEach( async keg_id => {
            const data = {
                date_shipped: date_shipped,
                keg_id,
                distributor_id: null,
                employee_email: formData.employee_email,
                keg_status: "returned"
            }

            await createHistory(data)
            await trackKeg(data, keg_id, abortController.signal)                
                .then(response => {
                    if (response.error) {
                        setError(response.error)
                    } else {
                        setAlert("Kegs successfully returned")
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

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <h2 className="subHeader">Return Kegs</h2>
            </Grid>
            <Grid item xs={6} >
                <Grid container justifyContent="center">
                    <FormControl>
                        <TextField  id ="outlined-basic" label="Keg Id" name="keg_name" margin="normal" onChange={handleKegChange} value={kegName} sx={{marginBottom: "30px"}}/>
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
                        
                        <h5 style={{marginBottom: '10px', marginTop: "25px"}}>Kegs Shipped: {keg_names.length}</h5>
                        <Button sx={{width:"50%", margin:"auto", marginTop: "15px"}} type="submit" variant='contained' color="success" onClick={handleSubmit}>Submit</Button>
                    </FormControl>                        

                </Grid>
            </Grid>
            <Grid item xs={6}>
                <Grid container direction="row" justifyContent="flex-start">
                    <FormatKegIdList kegIds={keg_names} onDelete={onDelete}/>
                </Grid>
                
            </Grid>
            <Grid item xs={6}>
                {error ? <Alert onClose={() => {setError(null)}} sx={{width: "40%", margin: "auto", marginTop: "20px"}} variant="filled" severity="error">{error}</Alert>: null}
                {alert ? <Alert onClose={() => {setAlert(null)}} sx={{width: "40%", margin: "auto", marginTop: "20px"}} variant="filled" severity="success">{alert}</Alert>: null}
            </Grid>       
        </Grid>
    )
}

export default ReturnKeg;