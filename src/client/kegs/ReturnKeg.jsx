import React, { useEffect, useState } from 'react'
import { createHistory, getDistributors, verifyKeg } from '../utils/api';
import DistAsSelect from '../distributors/DistAsSelect';
import FormatKegIdList from './FormatKegIdList';
import CustomInput from '../utils/CustomInput';

const ReturnKeg = () => {
    const date = new Date()
    const month = String(date.getMonth() + 1)
    const day = String(date.getDate())
    const initialFormState = {
        date_shipped: `${date.getFullYear()}-${"0"+month.slice(-2)}-${("0"+day).slice(-2)}`,
        keg_name: [],
        keg_status: "returned",
        shipped_to: null,
        employee_email: localStorage.getItem('user')
    }

    const [formData, setFormData] = useState(initialFormState);
    const [kegName, setKegName] = useState("")

    const handleKegChange = async ({target}) => {
        setKegName(target.value)
        if (target.value.length===4) {
            if (formData.keg_name.includes(target.value)) {
                setKegName("")
            } else {
                await verifyKeg({keg_name: target.value, keg_status: "returned"})
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
        //createHistory(formData, abortController.signal)
    }

    return (
        <div>
            <h1>Return Kegs</h1>
                <div className="row">
                    <div className="col-md-8">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                    <CustomInput label="Keg Id" color="blue" name="keg_name"  type="text" handleChange={handleKegChange} value={kegName}/> <br/>
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

export default ReturnKeg;