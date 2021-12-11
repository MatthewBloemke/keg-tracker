import React, { useEffect, useState } from 'react'
import { createHistory, getDistributors, getKegs, verifyKeg } from '../utils/api';
import DistAsSelect from '../distributors/DistAsSelect';
import FormatKegIdList from './FormatKegIdList';
import CustomInput from '../utils/CustomInput';

//todo: add a way to ship multiple kegs to one company at once, change returned to shipped in keg display

const TrackKeg = () => {
    const date = new Date()
    const month = String(date.getMonth() + 1)
    const day = String(date.getDate())
    const initialFormState = {
        date_shipped: `${date.getFullYear()}-${("0"+month).slice(-2)}-${("0"+day).slice(-2)}`,
        keg_id: [],
        distributor_id: "",
        employee_email: localStorage.getItem('user'),
        keg_status: "shipped",
    }

    const [keg_names, setKeg_names] = useState([]);
    const [dist, setDist] = useState([]);
    const [formData, setFormData] = useState(initialFormState);
    const [kegName, setKegName] = useState("");

    const handleChange = ({target}) => {
        setFormData({
            ...formData,
            [target.name]: target.value
        });
    };

    const handleKegChange = async ({target}) => {
        setKegName(target.value)
        if (target.value.length===4) {
            if (keg_names.includes(target.value)) {//add an error message here
                setKegName("")
            } else {
                await verifyKeg({keg_name: target.value})
                    .then(response => {
                        console.log()
                        if (response) {
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
        console.log(formData)
        const abortController = new AbortController()
        formData.keg_id.forEach(keg_id => {
            const data = {
                date_shipped: formData.date_shipped,
                keg_id,
                distributor_id: formData.distributor_id,
                employee_email: formData.employee_email,
                keg_status: "shipped"
            }
            console.log(data)
            createHistory(data)

        })
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
                    <FormatKegIdList kegIds={keg_names}/>
                </div>
            </div>
        </div>
    )
}

export default TrackKeg;