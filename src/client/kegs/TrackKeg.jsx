import React, { useEffect, useState } from 'react'
import { createHistory, trackKeg, getDistributors, getKegs, verifyKeg } from '../utils/api';
import FormatKegIdList from './FormatKegIdList';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel';
import {MenuItem, TextField, Alert} from '@mui/material'
import Select from '@mui/material/Select';
import {LocalizationProvider, DatePicker, } from '@mui/lab'
import DateFnsUtils from '@mui/lab/AdapterDateFns'
import "./TrackKeg.css"

//todo: add a way to ship multiple kegs to one company at once, change returned to shipped in keg display

const TrackKeg = () => {
    const date = new Date()
    const month = String(date.getMonth() + 1)
    const day = String(date.getDate())
    const initialFormState = {
        keg_id: [],
        employee_email: localStorage.getItem('user'),
        keg_status: "shipped",
    }
    const initialDate = `${date.getFullYear()}-${("0"+month).slice(-2)}-${("0"+day).slice(-2)}`

    const [keg_names, setKeg_names] = useState([]);
    const [distArr, setDistArr] = useState([]);
    const [dist, setDist] = useState("")
    const [date_shipped, setDate_shipped] = useState(initialDate)
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
                        //eventually add if statement for response.keg_status when client is ready for that functionality.
                        if (response.error) {
                            setError(response.error)
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
        <div>
            <h1 id='trackKegs'>Track Kegs</h1>
            <div className="row">
                <div className="col-md-8">
                    <form onSubmit={handleSubmit}>
                        <div className="row" id="trackKegContainer">
                            <div className="col-md-6" id='distContainer'>
                                <h3 style={{marginTop: "20px"}}>Choose a Distributor to Ship to</h3> <br/>
                                <Box sx={{ minWidth: 120 }}>
                                    <FormControl sx={{width: "80%"}}>
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
                                </Box>

                            </div>
                            <div className="col-md-6" id='inputContainer'>
                                <FormControl sx={{width: "50%", marginBottom: "30px"}}>
                                    <TextField  id ="outlined-basic" label="Keg Id" name="keg_name" margin="normal" onChange={handleKegChange} value={kegName} disabled={dist ? false : true}/> <br/>
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
                                

                            </div>
                        </div>
                        <button className='btn btn-success btn-lg' type="submit">Submit</button>
                    </form>
                    {error ? <Alert onClose={() => {setError(null)}} sx={{width: "40%", margin: "auto", marginTop: "20px"}} variant="filled" severity="error">{error}</Alert>: null}
                    {alert ? <Alert onClose={() => {setAlert(null)}} sx={{width: "40%", margin: "auto", marginTop: "20px"}} variant="filled" severity="success">{alert}</Alert>: null}
                </div>
                <div className="col-md-4" id='kegContainer'>
                    <FormatKegIdList kegIds={keg_names} onDelete={onDelete}/>
                </div>
                
            </div>
        </div>
    )
}

export default TrackKeg;