import React, { useEffect, useState } from "react"
import DistAsSelect from "../distributors/DistAsSelect";
import { createKeg, getDistributors } from "../utils/api";
import "./NewKeg.css"

const NewKeg = () => {
    const user = localStorage.getItem('user')
    const initialFormState ={
        keg_name: "",
        keg_status: "returned",
        keg_size: "large",
        date_shipped: "",
        distributor_id: "",
        employee_email: user
    }
    const [formData, setFormData] = useState(initialFormState);
    const [shipped, setShipped] = useState(false)
    const [dist, setDist] = useState([])

    useEffect(() => {
        const abortController = new AbortController()
        const loadDistributors = async () => {
            getDistributors(abortController.signal)
                .then(setDist)
                .catch(console.log) // add an error message handler            
        }
        loadDistributors()
        return () => abortController.abort()
    }, [])

    const handleChange = ({target}) => {
        if (target.value === "shipped" || formData.keg_status === "shipped") {
            setShipped(true)
        } else if (target.value === "returned" || formData.keg_status === "returned"){
            setShipped(false)
        }
        setFormData({
            ...formData, 
            [target.name]: target.value
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const controller = new AbortController();
        const invalidFields = [];
        if (!Number(formData.keg_name) || formData.keg_name.length != 4) {
            invalidFields.push("keg_name")
        }
        if (formData.keg_status === "shipped" && formData.distributor_id==="none") {
            invalidFields.push("distributor_id")
        }
        if (formData.keg_status === "shipped" && !formData.date_shipped) {
            invalidFields.push("date_shipped")
        }
        if (formData.keg_status === "shipped" && !formData.distributor_id) {
            invalidFields.push("distributor_id")
        }
        if (invalidFields.length) {
            console.log("invalid") // error message component here
        } else {
            await createKeg(formData, controller.signal)
        }
    }
    return (
        <main>
            <h1>New Keg</h1>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-3 labels">
                        <label htmlFor="keg_name">Keg Number</label> <br/>
                        <label htmlFor="keg_size">Keg Size</label> <br/>
                        <label htmlFor="keg_status">Keg Status</label> <br/>
                        <label htmlFor="date_shipped">Date Shipped</label> <br/>
                        {shipped ? <label htmlFor="distributor_id">Distributor</label> : null}
                    </div>
                    <div className="col-md-3 inputs">
                        <input type="text" id="keg_name" name="keg_name" value={formData.keg_name} onChange={handleChange}/> <br/>
                        <select id="keg_size" onChange={handleChange}> 
                            <option value="large">Large</option>
                            <option value="small">Small</option>
                        </select> <br/>
                        <select id="keg_status" name="keg_status" onChange={handleChange}>
                            <option value="returned">Returned</option> 
                            <option value="shipped">Shipped</option>
                        </select> <br/>
                        <input type="date" id="date_shipped" name="date_shipped" value={formData.date_shipped} onChange={handleChange}/> <br/>
                        {shipped ? <select id="distributor_id" name="distributor_id" onChange={handleChange}><DistAsSelect dist={dist} /></select> : null} <br/>
                        
                        <button type="submit">Submit</button>
                    </div>
                </div>
            </form>
        </main>

    )
}

export default NewKeg;