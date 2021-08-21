import React, { useEffect, useState } from 'react'
import { createHistory, getDistributors, verifyKeg } from '../utils/api';
import DistAsSelect from '../distributors/DistAsSelect';
import FormatKegIdList from './FormatKegIdList';
import CustomInput from '../utils/CustomInput';

//todo: add a way to ship multiple kegs to one company at once, change returned to shipped in keg display

const TrackKeg = () => {
    const date = new Date()
    const month = String(date.getMonth() + 1)
    const day = String(date.getDate())
    const initialFormState = {
        date_shipped: `${date.getFullYear()}-${"0"+month.slice(-2)}-${("0"+day).slice(-2)}`,
        keg_name: [],
        distributor_id: "",
        employee_email: localStorage.getItem('user')

    }

    const [dist, setDist] = useState([])
    const [formData, setFormData] = useState(initialFormState);
    const [kegName, setKegName] = useState("")

    const handleChange = ({target}) => {
        setFormData({
            ...formData,
            [target.name]: target.value
        })
    }

    const handleKegChange = async ({target}) => {
        setKegName(target.value)
        if (target.value.length===4) {
            if (formData.keg_name.includes(target.value)) {
                setKegName("")
            } else {
                await verifyKeg({keg_name: target.value})
                    .then(response => {
                        if (response.status === 200) {
                            setFormData({
                                ...formData,
                                keg_name: [...formData.keg_name, target.value]
                            })
                        }
                    })

                setKegName("")                
            }

        }
        
        
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        console.log(formData)
        const abortController = new AbortController()
        createHistory(formData, abortController.signal)
    }

    useEffect(() => {
        const abortController = new AbortController()
        getDistributors(abortController.signal)
            .then(setDist)

        return () => abortController.abort()
    }, [])

    return (
        <div>
            <h1>Track Kegs</h1>
                <div className="row">
                    <div className="col-md-8">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6">
                                    <label htmlFor="distributor_id">Distributor</label> <br/>
                                    <select id="distributor_id" name="distributor_id" onChange={handleChange}><DistAsSelect dist={dist}/></select> <br/>       
                                </div>
                                <div className="col-md-6">
                                    <CustomInput label="Keg Id" color="blue" name="keg_name"  type="text" handleChange={handleKegChange} value={kegName}/> <br/>
                                    <CustomInput label="date" color="blue" type="date" name="date_shipped" handleChange={handleChange} value={formData.date_shipped}/>
                                </div>
                            </div>
                            <button type="submit">Submit</button>
                        </form>
                    </div>
                    <div className="col-md-4">
                        <FormatKegIdList kegIds={formData.keg_name}/>
                    </div>
                    
                </div>
            
            
        </div>
    )
}

export default TrackKeg;