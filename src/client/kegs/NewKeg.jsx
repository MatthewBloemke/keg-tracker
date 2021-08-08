import React, { useState } from "react"

const NewKeg = () => {
    const initialFormState ={
        keg_name: "",
        keg_status: "shipped",
        keg_size: "large",
        date_shipped: ""
    }
    const [formData, setFormData] = useState(initialFormState);

    const handleChange = ({target}) => {
        console.log(target.value)
        setFormData({
            ...formData,
            [target.name]: target.value
        })
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        console.log(formData)
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
                    </div>
                    <div className="col-md-3 inputs">
                        <input type="text" id="keg_name" name="keg_name" value={formData.keg_name} onChange={handleChange}/> <br/>
                        <select id="keg_size" onChange={handleChange}> 
                            <option value="large">Large</option>
                            <option value="small">Small</option>
                        </select> <br/>
                        <select id="keg_status" onChange={handleChange}> 
                            <option value="shipped">Shipped</option>
                            <option value="returned">Returned</option>
                        </select> <br/>
                        <input type="date" id="date_shipped" name="date_shipped" value={formData.keg_name} onChange={handleChange}/> <br/>
                        <button type="submit">Submit</button>
                    </div>
                </div>
            </form>
        </main>

    )
}

export default NewKeg;