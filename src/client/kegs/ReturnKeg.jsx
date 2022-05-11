import React, { useEffect, useState } from 'react'
import { createHistory, readDistributor, trackKeg, updateDaysOut, verifyKeg } from '../utils/api';
import FormatKegIdList from './FormatKegIdList';
import {FormControl, TextField, Alert, Grid, Button, Typography } from '@mui/material'
import {LocalizationProvider, DatePicker, } from '@mui/lab'
import DateFnsUtils from '@mui/lab/AdapterDateFns'
import RenderQrReader from '../utils/RenderQrReader'
import {useHistory, useParams} from 'react-router-dom'
import { isMobile } from 'react-device-detect';
import UIfx from 'uifx'
import mp3File from '../../success.mp3'



const ReturnKeg = () => {
    const history = useHistory()
    const params = useParams()
    const user = localStorage.getItem('user');
    const [keg_data, setKeg_data] = useState([])
    const [keg_names, setKeg_names] = useState([])
    const [kegName, setKegName] = useState("")
    const [alert, setAlert] = useState(null)
    const [error, setError] = useState(null)
    const [scanning, setScanning] = useState(true)
    const [scanAlert, setScanAlert] = useState(null)
    const [scanError,setScanError] = useState(null)
    const [date_shipped, setDate_shipped] = useState(new Date(Date.now()))
    const [scannedKeg, setScannedKeg] = useState("")


    const handleKegChange = async ({target}) => {
        const controller = new AbortController()
        setKegName(target.value)
        if (target.value.length===4) {
            if (keg_names.includes(target.value)) {
                setError(`Keg ${target.value} has already been added`)
                setKegName("")
            } else {
                await verifyKeg({keg_name: target.value}, controller.signal)
                    .then(async (response) => {
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
                            await readDistributor(response.shipped_to, controller.signal)
                                .then((dist_response) => {
                                    if (dist_response.error) {
                                        setError(dist_response.error)
                                    } else {
                                        setKeg_data([...keg_data, [response.keg_name, response.keg_id, dist_response, Math.round(timeDifference/1000/3600/24)]])
                                        setKeg_names([...keg_names, response.keg_name])
                                    }
                                })

                        }

                    })
                    .catch(err => {
                        setError(err)
                    })
                setKegName("")     
            }
        }
    }
    const handleSwitch = () => {
        if (params.mode === "environment") {
            history.push('/kegs/return/user')
            history.go(0)
        } else {
            history.push("/kegs/return/environment")
            history.go(0)
        }
    }

    useEffect(() => {
        const handleScan = async () => {
            setScanning(false)
            const controller = new AbortController()
            if (scannedKeg.length===4) {
                if (keg_names.includes(scannedKeg)) {
                    setScanError(`Keg ${scannedKeg} has already been added`)
                    setScannedKeg("")
                } else {
                    await verifyKeg({keg_name: scannedKeg}, controller.signal)
                        .then( async (response) => {
                            let timeA = new Date(response.date_shipped);
                            let timeB = new Date(date_shipped);
                            timeA.setHours(0,0,0,0)
                            timeB.setHours(0,0,0,0)
                            let timeDifference = timeB.getTime() - timeA.getTime()
                            if (response.error) {
                                setScanError(response.error)
                            } else if (response.keg_status === "returned") {
                                setScanError(`Keg ${response.keg_name} has already been returned`)
                            } else if (timeDifference < 0) {
                                setScanError(`Returned date cannot be before the Keg's shipped date of ${timeA}`)
                            } else {
                                await readDistributor(response.shipped_to, controller.signal)
                                    .then((dist_response) => {
                                        if (dist_response.error) {
                                            setScanError(dist_response.error)
                                        } else {
                                            setScanAlert(`${response.keg_name} added`)
                                            setKeg_data([...keg_data, [response.keg_name, response.keg_id, dist_response, Math.round(timeDifference/1000/3600/24)]])
                                            setKeg_names([...keg_names, response.keg_name])
                                        }
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
    }, [scannedKeg])

    const handleSubmit = async (event) => {
        event.preventDefault()
        date_shipped.setHours(0,0,0,0)
        const daysOutUpdate = {};
        const abortController = new AbortController()
        for (let i = 0; i < keg_data.length; i++) {
            const data = {
                date_shipped: date_shipped,
                keg_id: keg_data[i][1],
                distributor_id: null,
                employee_email: user,
                keg_status: "returned"
            }
            let daysOutData= [];
            if (daysOutUpdate[keg_data[i][2].distributor_name]) {
                daysOutData = [...daysOutUpdate[keg_data[i][2].distributor_name], keg_data[i][3]];
            } else {
                daysOutData = keg_data[i][2].days_out_arr ? [...keg_data[i][2].days_out_arr, keg_data[i][3]]: [keg_data[i][3]]
            }
            const distData = {
                distributor_name: keg_data[i][2].distributor_name,
                days_out_arr: daysOutData
            }
            await createHistory(data, abortController.signal)
                .then(async (response) => {
                    if (response.error) {
                        setError(response.error)
                    } else {
                        await updateDaysOut(distData, keg_data[i][2].distributor_id, abortController.signal)
                            .then(async (secondResponse) => {
                                if (secondResponse.error) {
                                    setError(`History Created, but ${secondResponse.error}`)
                                } else {
                                    daysOutUpdate[keg_data[i][2].distributor_name] = distData.days_out_arr;
                                    
                                    await trackKeg(data, keg_data[i][1], abortController.signal)                
                                        .then(thirdResponse => {
                                            if (thirdResponse.error) {
                                                setError(`History created, days out updated, but ${thirdResponse.error}`)
                                            } else {
                                                setAlert("Kegs successfully returned")
                                            }
                                        })
                                }
                            })
                    }
                })
        }
        setKeg_data([])
        setKeg_names([])
    }

    const onDelete = (e) => {
        const index = keg_data.indexOf(e.currentTarget.name)
        let tempDataArr = keg_data;
        let tempNameArr = keg_names
        tempDataArr.splice(index, 1);
        tempNameArr.splice(index, 1)
        setKeg_data([...tempDataArr]);
        setKeg_names([...tempNameArr])
    }

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                {scanError ? <Alert onClose={() => {setScanError(null)}} sx={{width: "40%", margin: "auto", marginTop: "20px"}} variant="filled" severity="error">{scanError}</Alert>: null}
                {scanAlert ? <Alert onClose={() => {setScanAlert(null)}} sx={{width: "40%", margin: "auto", marginTop: "20px"}} variant="filled" severity="success">{scanAlert}</Alert>: null}
            </Grid>
            <Grid item xs={12} >
                <Grid container alignItems='center' direction="column">
                    {isMobile ? <Button sx={{mb:"15px"}} onClick={handleSwitch} variant="contained">Switch Camera</Button> : null }
                    {isMobile
                        ?
                        
                        <div style={{height:'250px', width: "250px"}}>
                            {scanning ? <RenderQrReader cameraMode={params.mode} handleScan={setScannedKeg}/> : null}
                        </div> 
                         : null
                    }
                    <FormControl sx={{ minWidth: "250px", width: "10%"}}>
                        <TextField  id ="outlined-basic" label="Keg Id" name="keg_name" margin="normal" onChange={handleKegChange} value={kegName} sx={{ minWidth: "250px", width: "10%", mb: "20px"}}/>
                        <LocalizationProvider  dateAdapter={DateFnsUtils}>
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
                        <Typography textAlign='center' variant='h6' component='div' sx={{marginBottom: "10px", mt: "20px"}}>
                            Kegs Returned: {keg_names.length}
                        </Typography>
                        <Button sx={{width:"50%", margin:"auto", marginTop: "15px"}} type="submit" variant='contained' onClick={handleSubmit}>Submit</Button>
                    </FormControl>                        
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container direction="row" justifyContent="space-around">
                    <FormatKegIdList kegIds={keg_data} onDelete={onDelete}/>
                </Grid>
                
            </Grid>
            <Grid item xs={12}>
                {error ? <Alert onClose={() => {setError(null)}} sx={{width: "40%", margin: "auto", marginTop: "20px"}} variant="filled" severity="error">{error}</Alert>: null}
                {alert ? <Alert onClose={() => {setAlert(null)}} sx={{width: "40%", margin: "auto", marginTop: "20px"}} variant="filled" severity="success">{alert}</Alert>: null}
            </Grid>
        </Grid>
    )
}

export default ReturnKeg;