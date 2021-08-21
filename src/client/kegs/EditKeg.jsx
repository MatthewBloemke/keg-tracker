import React, { useEffect, useState } from "react"
import { useParams } from "react-router";
import { createKeg, editKeg, getDistributors, readKeg } from "../utils/api";
import "./NewKeg.css"

const EditKeg = () => {
    const params = useParams()
    const user = localStorage.getItem('user')
    const initialFormState ={
        keg_name: "",
        keg_status: "returned",
        keg_size: "large",
        employee_email: user
    }

    useEffect(() => {
        const loadKeg = async () => {
            await readKeg(params.kegName)
                .then(response => {
                    console.log(response[0].keg_name)
                    setFormData({
                        ...formData,
                        keg_name: response[0].keg_name,
                        keg_size: response[0].keg_size
                    })
                })            
        }
        loadKeg()
    }, [params.kegName])

    const [formData, setFormData] = useState(initialFormState);

    const handleChange = ({target}) => {
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
        if (invalidFields.length) {
            console.log("invalid") // error message component here
        } else {
            await editKeg(formData)
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
                    </div>
                    <div className="col-md-3 inputs">
                        <input type="text" id="keg_name" name="keg_name" value={formData.keg_name} onChange={handleChange}/> <br/>
                        <select id="keg_size" name="keg_size" value={formData.keg_size} onChange={handleChange}> 
                            <option value="large">Large</option>
                            <option value="small">Small</option>
                        </select> <br/>
                        <button type="submit">Submit</button>
                    </div>
                </div>
            </form>
        </main>

    )
}

export default EditKeg;