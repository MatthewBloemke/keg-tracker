import React, { useEffect, useState } from 'react'
import { createHistory, getDistributors, trackKeg, verifyKeg } from '../utils/api';
import DistAsSelect from '../distributors/DistAsSelect';
import FormatKegIdList from './FormatKegIdList';
import CustomInput from '../utils/CustomInput';

const ReturnKeg = () => {
    const date = new Date()
    const month = String(date.getMonth() + 1)
    const day = String(date.getDate())
    const initialFormState = {
        date_shipped: `${date.getFullYear()}-${"0"+month.slice(-2)}-${("0"+day).slice(-2)}`,
        keg_id: [],
        keg_status: "returned",
        shipped_to: null,
        employee_email: localStorage.getItem('user')
    }


    const [keg_names, setKeg_names] = useState([])
    const [formData, setFormData] = useState(initialFormState);
    const [kegName, setKegName] = useState("")

    const handleKegChange = async ({target}) => {
        setKegName(target.value)
        if (target.value.length===4) {
            if (keg_names.includes(target.value)) {//add error message here
                setKegName("")
            } else {
                await verifyKeg({keg_name: target.value})
                    .then(response => {
                        //add functionality to only allow shipped kegs to pass
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
        console.log(formData)
        const abortController = new AbortController()
        formData.keg_id.forEach( async keg_id => {
            const data = {
                date_shipped: formData.date_shipped,
                keg_id,
                distributor_id: null,
                employee_email: formData.employee_email,
                keg_status: "returned"
            }

            await createHistory(data)
            await trackKeg(data, keg_id)
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
                        <FormatKegIdList kegIds={keg_names} onDelete={onDelete}/>
                    </div>
                </div>
        </div>
    )
}

export default ReturnKeg;