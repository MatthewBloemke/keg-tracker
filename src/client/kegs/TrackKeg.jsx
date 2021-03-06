import React, { useEffect, useState } from 'react'
import { createHistory, trackKeg, getDistributors, verifyKeg } from '../utils/api';
import FormatKegIdList from './FormatKegIdList';
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel';
import {MenuItem, TextField, Alert, Button, Grid, AppBar, Typography, Divider, useMediaQuery, Switch} from '@mui/material'
import Select from '@mui/material/Select';
import {LocalizationProvider, DatePicker} from '@mui/lab'
import DateFnsUtils from '@mui/lab/AdapterDateFns'
import { useTheme } from "@mui/material/styles";
import "./TrackKeg.css"
import RenderQrReader from '../utils/RenderQrReader'
import {useHistory, useParams} from 'react-router-dom'
import { isMobile } from 'react-device-detect';

const TrackKeg = () => {
    const initialFormState = {
        keg_id: [],
        employee_email: localStorage.getItem('user'),
        keg_status: "shipped",
    }

    const history = useHistory()
    const params = useParams()
    
    const [keg_names, setKeg_names] = useState([]);
    const [distArr, setDistArr] = useState([]);
    const [dist, setDist] = useState("")
    const [date_shipped, setDate_shipped] = useState(new Date(Date.now()))
    const [formData, setFormData] = useState(initialFormState);
    const [kegName, setKegName] = useState("");
    const [scannedKeg, setScannedKeg] = useState("")
    const [alert, setAlert] = useState(null)
    const [error, setError] = useState(null)
    const [scanError, setScanError] = useState(null);
    const [scanAlert, setScanAlert] = useState(null);
    const [scanning, setScanning] = useState(true);



    const handleDistChange = (event) => {
        setDist(event.target.value)
    }
    const handleSwitch = () => {
        if (params.mode === "environment") {
            history.push('/kegs/track/user')
            history.go(0)
        } else {
            history.push("/kegs/track/environment")
            history.go(0)
        }
    }


    const handleKegChange = async ({target}) => {
        const controller = new AbortController()
        setKegName(target.value)
        if (target.value.length===4) {
            if (keg_names.includes(target.value)) {
                setError(`Keg ${target.value} has already been added`)
                setKegName("")
            } else {
                await verifyKeg({keg_name: target.value}, controller.signal)
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
                            setKeg_names([...keg_names, response.keg_name])
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
            
            await createHistory(data, abortController.signal)
                .then(async (response) => {
                    if (response.error) {
                        setError(response.error)
                    } else {
                        await trackKeg(data, keg_id, abortController.signal)
                            .then(secondResponse => {
                                if (secondResponse.error) {
                                    setError(secondResponse.error)
                                } else {
                                    setAlert("Kegs successfully shipped and updated!")
                                }
                            })                        
                    }
                })


        })            
        setFormData(initialFormState)
        setKeg_names([])
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
        const loadDistributors = async () => {
            await getDistributors(abortController.signal)
                .then(response => {
                    if (response.error) {
                        setError(response.error)
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
        if (distArr.length===0) {
            loadDistributors()
        }
        
        const handleScan = async () => {
            setScanning(false)
            const controller = new AbortController()
            if (scannedKeg.length===4) {
                if (keg_names.includes(scannedKeg)) {
                    setScanError(`Keg ${scannedKeg} has already been added`)
                    setScannedKeg("")
                } else {
                    await verifyKeg({keg_name: scannedKeg}, controller.signal)
                        .then(response => {
                            console.log(response)
                            let timeA = new Date(response.date_shipped);
                            let timeB = new Date(date_shipped);
                            timeA.setHours(0,0,0,0)
                            timeB.setHours(0,0,0,0)
                            let timeDifference = timeB.getTime() - timeA.getTime()
                            if (response.error) {
                                setScanError(response.error)
                            } else if (response.keg_status === "shipped") {
                                setScanError(`Keg ${response.keg_name} is already shipped.`)
                            } else if (timeDifference < 0) {
                                setScanError(`Keg cannot be shipped before latest return date of ${timeA}`)
                            } else {
                                setScanAlert(`Keg ${response.keg_name} added`)
                                setKeg_names([...keg_names, response.keg_name])
                                setFormData({
                                    ...formData,
                                    keg_id: [...formData.keg_id, response.keg_id]
                                })                  
                            }
                        })
                        setScannedKeg("")      
                }
    
            } else {
                if (scannedKeg) {
                    setScanError(`${scannedKeg} is not four digits`)
                }
            }
            setTimeout(() => setScanning(true), 2000)   
        }
        handleScan()
        return () => abortController.abort()
    }, [scannedKeg])

    return (
        <Grid container spacing={3}>
                <Grid container justifyContent="center" spacing={1}>
                    {scanError ? <Alert onClose={() => {setScanError(null)}} sx={{width: "40%", margin: "auto", marginTop: "20px"}} variant="filled" severity="error">{scanError}</Alert>: null}
                    {scanAlert ? <Alert onClose={() => {setScanAlert(null)}} sx={{width: "40%", margin: "auto", marginTop: "20px"}} variant="filled" severity="success">{scanAlert}</Alert>: null}
                </Grid>
            <Grid item xs={12}>
                <Grid container alignItems="center" direction="column">
                    <FormControl sx={{ minWidth: "250px", width: "10%"}}>
                        <InputLabel>Distributor</InputLabel>
                        <Select
                            value={dist}
                            label="Distributor"
                            name="distributor_id"
                            onChange={handleDistChange}
                        >
                        {distArr}
                        </Select>                                        
                    </FormControl> <br/>
                    {isMobile ? <Button sx={{mb:"15px"}} onClick={handleSwitch} variant="contained">Switch Camera</Button> : null }
                    {isMobile
                        ?
                        <div style={{height:'250px', width: "250px"}}>
                            {scanning ? <RenderQrReader cameraMode={params.mode} handleScan={setScannedKeg}/> : null}
                        </div> 
                        : null
                    }
                   
                    <TextField sx={{marginBottom: '15px', width: "10%", minWidth: "250px"}}  id ="outlined-basic" label="Keg Id" name="keg_name" margin="normal" onChange={handleKegChange} value={kegName} disabled={dist ? false : true}/> <br/>
                    <FormControl sx={{width: "10%", minWidth: "250px", marginBottom: "30px"}}>
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
                <Grid container justifyContent="center">
                    <Typography variant='h6' component='div' sx={{marginBottom: "15px"}}>
                        Kegs Shipped: {keg_names.length}
                    </Typography>
                </Grid>
                <Grid container justifyContent="center">
                    <Button onClick={handleSubmit} size="large" variant="contained">Submit</Button>
                </Grid>
            </Grid>
            <Grid item xs={12} >
                <Grid container direction="row" justifyContent="space-around">
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