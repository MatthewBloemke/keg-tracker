import React, { useEffect, useState } from 'react'
import { createFillingHistory,getFlavors, verifyKeg } from '../utils/api';
import FormatKegIdList from './FormatKegIdList';
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel';
import {MenuItem, TextField, Alert, Button, Grid, AppBar, Typography, Divider, useMediaQuery, Switch} from '@mui/material'
import Select from '@mui/material/Select';
import {LocalizationProvider, DatePicker} from '@mui/lab';
import DateFnsUtils from '@mui/lab/AdapterDateFns';
import { useTheme } from "@mui/material/styles";
import "./TrackKeg.css";
import RenderQrReader from '../utils/RenderQrReader';
import {useHistory, useParams} from 'react-router-dom';

const FillKeg = () => {
    const initialFormState = {
        keg_id: [],
        employee_email: localStorage.getItem('user'),
    };

    const history = useHistory();
    const params = useParams();
    
    const [keg_names, setKeg_names] = useState([]);
    const [flavorArr, setFlavorsArr] = useState([]);
    const [flavor, setFlavor] = useState("");
    const [date_filled, setDate_filled] = useState(new Date(Date.now()));
    const [formData, setFormData] = useState(initialFormState);
    const [kegName, setKegName] = useState("");
    const [scannedKeg, setScannedKeg] = useState("");
    const [alert, setAlert] = useState(null);
    const [error, setError] = useState(null);
    const [scanError, setScanError] = useState(null);
    const [scanAlert, setScanAlert] = useState(null);
    const [scanning, setScanning] = useState(true);
    
    const theme = useTheme();
    const smallScreen = (!useMediaQuery(theme.breakpoints.up('sm')))



    const handleFlavorChange = (event) => {
        setFlavor(event.target.value)
    }
    const handleSwitch = () => {
        if (params.mode === "environment") {
            history.push('/kegs/fill/user')
            history.go(0)
        } else {
            history.push("/kegs/fill/environment")
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
                        if (response.error) {
                            setError(response.error)
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
        date_filled.setHours(0,0,0,0)
        formData.keg_id.forEach( async keg_id => {
            const data = {
                date_filled: date_filled,
                keg_id,
                flavor_id: flavor,
                employee_email: formData.employee_email,
            }
            
            await createFillingHistory(data, abortController.signal)
                .then(async (response) => {
                    if (response.error) {
                        setError(response.error)
                    } else {
                        setAlert("Kegs successfully filled!")            
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
        const loadFlavors = async () => {
            await getFlavors(abortController.signal)
                .then(response => {
                    console.log(response)
                    if (response.error) {
                        setError(response.error)
                    } else {
                        const flavorOptions = []
                        const tempFlavors = response;
                        tempFlavors.sort((a, b) => {
                            return a.flavor_name.toLowerCase().localeCompare(b.flavor_name.toLowerCase());
                        })
                        tempFlavors.forEach(item => {
                            flavorOptions.push(
                                <MenuItem key={item.flavor_id} value={item.flavor_id}>{item.flavor_name}</MenuItem>
                            )      
                        })
                        setFlavorsArr(flavorOptions)                        
                    }

                })            
        }
        if (flavorArr.length===0) {
            loadFlavors()
        }
        
        const handleScan = async () => {
            setScanning(false)
            const controller = new AbortController()
            if (scannedKeg.length===4) {
                if (keg_names.includes(scannedKeg)) {
                    setError(`Keg ${scannedKeg} has already been added`)
                    setScannedKeg("")
                } else {
                    await verifyKeg({keg_name: scannedKeg}, controller.signal)
                        .then(response => {
                            if (response.error) {
                                setError(response.error)
                            } else {
                                setKeg_names([...keg_names, response.keg_name])
                                setFormData({
                                    ...formData,
                                    keg_id: [...formData.keg_id, response.keg_id]
                                })                  
                            }
                        })
                        setScannedKeg("")      
                }
    
            }
            setTimeout(() => setScanning(true), 2000)   
        }
        handleScan()
        return () => abortController.abort()
    }, [scannedKeg])

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Grid container alignItems="center" direction="column">
                    <FormControl sx={{ minWidth: "250px", width: "10%"}}>
                        <InputLabel>Flavors</InputLabel>
                        <Select
                            value={flavor}
                            label="Flavors"
                            name="flavor_id"
                            onChange={handleFlavorChange}
                        >
                        {flavorArr}
                        </Select>                                        
                    </FormControl> <br/>
                    {smallScreen ? <Button sx={{mb:"15px"}} onClick={handleSwitch} variant="contained">Switch Camera</Button> : null }
                    {smallScreen 
                        ?
                        
                        <div style={{height:'250px', width: "250px"}}>
                            {scanning ? <RenderQrReader cameraMode={params.mode} handleScan={setScannedKeg}/> : null}
                        </div> 
                        : null
                    }
                   
                    <TextField sx={{marginBottom: '15px', width: "10%", minWidth: "250px"}}  id ="outlined-basic" label="Keg Id" name="keg_name" margin="normal" onChange={handleKegChange} value={kegName} disabled={flavor ? false : true}/> <br/>
                    <FormControl sx={{width: "10%", minWidth: "250px", marginBottom: "30px"}}>
                        <LocalizationProvider dateAdapter={DateFnsUtils}>
                            <DatePicker
                                label="Date Filled"
                                value={date_filled}
                                name="date_filled"
                                onChange={(newDate) => {
                                    setDate_filled(newDate);
                                }}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                    </FormControl>
                </Grid>
                <Grid container justifyContent="center">
                    <Typography variant='h6' component='div' sx={{marginBottom: "15px"}}>
                        Kegs Filled: {keg_names.length}
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
    );
};

export default FillKeg;