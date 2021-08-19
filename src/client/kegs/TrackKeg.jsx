import React, { useEffect, useState } from 'react'
import { createHistory, getDistributors } from '../utils/api';
import DistAsSelect from '../distributors/DistAsSelect';

//todo: add a way to ship multiple kegs to one company at once, change returned to shipped in keg display

const TrackKeg = () => {
    const date = new Date()
    const month = String(date.getMonth() + 1)
    const day = String(date.getDate())
    const initialFormState = {
        date_shipped: `${date.getFullYear()}-${"0"+month.slice(-2)}-${("0"+day).slice(-2)}`,
        keg_name: "",
        distributor_id: "",
        employee_email: localStorage.getItem('user')

    }

    const [dist, setDist] = useState([])
    const [formData, setFormData] = useState(initialFormState);

    const handleChange = ({target}) => {
        setFormData({
            ...formData,
            [target.name]: target.value
        })
    }

    const handleSubmit = (event) => {
        event.preventDefault()
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
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-3">
                        <label htmlFor="keg_name">Keg Id</label> <br/>
                        <label htmlFor="distributor_id">Distributor</label> <br/>
                        <label htmlFor="date_shipped">Date</label>
                    </div>
                    <div className="col-md-3">
                        <input name="keg_name" id="keg_name" type="text" onChange={handleChange} value={formData.keg_name}/> <br/>
                        <select id="distributor_id" name="distributor_id" onChange={handleChange}><DistAsSelect dist={dist}/></select> <br/>
                        <input type="date" name="date_shipped" id="date_shipped" onChange={handleChange} value={formData.date_shipped}/>
                    </div>
                    <button type="submit">Submit</button>
                </div>

            </form>
            <mwc-textfield></mwc-textfield>
        </div>
    )
}

export default TrackKeg;