import React, { useEffect, useState } from 'react'
import { createHistory, trackKeg, getDistributors, getKegs, verifyKeg } from '../utils/api';
import FormatKegIdList from './FormatKegIdList';
import CustomInput from '../utils/CustomInput';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel';
import {MenuItem, TextField} from '@mui/material'
import Select from '@mui/material/Select';
import "./TrackKeg.css"

//todo: add a way to ship multiple kegs to one company at once, change returned to shipped in keg display

const TrackKeg = () => {
    const date = new Date()
    const month = String(date.getMonth() + 1)
    const day = String(date.getDate())
    const initialFormState = {
        date_shipped: `${date.getFullYear()}-${("0"+month).slice(-2)}-${("0"+day).slice(-2)}`,
        keg_id: [],
        employee_email: localStorage.getItem('user'),
        keg_status: "shipped",
    }

    const [keg_names, setKeg_names] = useState([]);
    const [distArr, setDistArr] = useState([]);
    const [dist, setDist] = useState("")
    const [formData, setFormData] = useState(initialFormState);
    const [kegName, setKegName] = useState("");

    const handleChange = (event) => {
        console.log("change")
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const handleDistChange = (event) => {
        setDist(event.target.value)
    }

    const handleKegChange = async ({target}) => {
        setKegName(target.value)
        if (target.value.length===4) {
            if (keg_names.includes(target.value)) {//add an error message here
                setKegName("")
            } else {
                await verifyKeg({keg_name: target.value})
                    .then(response => {
                        //eventually add if statement for response.keg_status when client is ready for that functionality.
                        setKeg_names([...keg_names, target.value])
                        setFormData({
                            ...formData,
                            keg_id: [...formData.keg_id, response.keg_id]
                        })
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
        const abortController = new AbortController()
        formData.keg_id.forEach( async keg_id => {
            const data = {
                date_shipped: formData.date_shipped,
                keg_id,
                distributor_id: dist,
                employee_email: formData.employee_email,
                keg_status: "shipped"
            }
            
            await createHistory(data)
            await trackKeg(data, keg_id, abortController.signal)
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
                                <h3>Choose a Distributor to Ship to</h3> <br/>
                                <Box sx={{ minWidth: 120 }}>
                                    <FormControl sx={{width: "80%"}}>
                                        <InputLabel>Distributor</InputLabel>
                                        <Select
                                            value={dist}
                                            label="Distributor"
                            
                                            name="distributor_id"
                                            onChange={handleDistChange}
                                            // sx={{color: 'blue'}}
                                        >
                                            {distArr}
                                            {/* {dist.map(item => {
                                                <MenuItem sx={{color:"blue"}} key={item.distributor_id} value={item.distributor_id}>{item.distributor_name}</MenuItem>
                                            })} */}
                                        </Select>                                        
                                    </FormControl>
                                </Box>

                            </div>
                            <div className="col-md-6" id='inputContainer'>
                            <TextField id ="outlined-basic" label="Keg Id" name="keg_name" margin="normal" onChange={handleKegChange} value={kegName} disabled={dist ? false : true}/> <br/>
                                {/* <CustomInput label="Keg Id" color="blue" name="keg_name"  type="text" handleChange={handleKegChange} value={kegName} disabled={dist ? null : "disabled"}/> <br/> */}
                                <CustomInput label="date" color="blue" type="date" name="date_shipped" handleChange={handleChange} value={formData.date_shipped}/>
                            </div>
                        </div>
                        <button className='btn btn-success btn-lg' type="submit">Submit</button>
                    </form>
                </div>
                <div className="col-md-4" id='kegContainer'>
                    <FormatKegIdList kegIds={keg_names} onDelete={onDelete}/>
                </div>
            </div>
        </div>
    )
}

export default TrackKeg;