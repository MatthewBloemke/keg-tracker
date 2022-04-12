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
import { QrReader } from 'react-qr-reader'

const TrackKeg = () => {
    const initialFormState = {
        keg_id: [],
        employee_email: localStorage.getItem('user'),
        keg_status: "shipped",
    }
    const facingModeUser = 'user'
    const facingModeEnv = "environment"
    
    const [keg_names, setKeg_names] = useState([]);
    const [distArr, setDistArr] = useState([]);
    const [dist, setDist] = useState("")
    const [date_shipped, setDate_shipped] = useState(new Date(Date.now()))
    const [formData, setFormData] = useState(initialFormState);
    const [kegName, setKegName] = useState("");
    const [alert, setAlert] = useState(null)
    const [error, setError] = useState(null)
    const theme = useTheme();
    const smallScreen = (!useMediaQuery(theme.breakpoints.up('sm')))
    const [facingMode, setFacingMode] = useState(facingModeUser)



    const handleDistChange = (event) => {
        setDist(event.target.value)
    }

    const videoConstraints = {facingMode: facingModeUser}

    const handleSwitch = () => {
        setFacingMode(
            prevState =>
                prevState === facingModeUser
                    ? facingModeEnv
                    : facingModeUser
        )
    }

    const handleKegChange = async ({target}) => {
        const controller = new AbortController()
        if (target.value.length===4) {
            if (keg_names.includes(target.value)) {
                setError(`Keg ${target.value} has already been added`)
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
            }
        }
    }

    const handleScan = async (result) => {
        const controller = new AbortController()
        if (result.length===4) {
            if (keg_names.includes(result)) {
                setError(`Keg ${result} has already been added`)
            } else {
                await verifyKeg({keg_name: result}, controller.signal)
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

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Divider/>
                <AppBar position='static'>
                    <Typography variant='h5' component='div' textAlign={smallScreen ? "center" : null} sx={{flexGrow: 1, pl: '10px', pb: '10px', pt: '10px'}}>
                        Ship Kegs
                    </Typography>
                </AppBar>
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
                    <Switch onChange={handleSwitch} />
                    <p>{facingMode}</p>
                    <div style={{height:'250px', width: "250px"}}>
                        <QrReader
                            constraints={{
                                ...videoConstraints,
                                facingMode
                            }}
                            onResult={(result, error) => {
                                if (!!result) {
                                    handleScan(result?.text);
                                }
                            }}
  
                        />
                    </div>
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