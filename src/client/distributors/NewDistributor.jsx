import React, {useState} from 'react'
import { useHistory } from 'react-router-dom';
import { createDistributor } from "../utils/api"

//add pop up notifying of keg created/ not created


const NewDistributor = () => {
    const history = useHistory()
    const initialFormState = {
        distributor_name: ""
    };

    const [formData, setFormData] = useState(initialFormState);
    const [disabled, setDisabled] = useState("disabled")

    const handleChange = ({target}) => {
        if (target.value.length > 0) {
            setDisabled(null)
        } else {
            setDisabled("disabled")
        }
        setFormData({
            ...formData,
            [target.name]: target.value
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const controller = new AbortController();

        if (formData.distributor_name.length === 0) {
            //set an error message to display here
        } else {
            await createDistributor(formData, controller.signal);
            setFormData("initialFormState")
            history.push("/distributors")
        }
    }

    return (
        <main>
            <h1>New Distributor</h1>
            <form onSubmit={handleSubmit}>
                <div className='row'>
                    <div className='col-md-3 labels'>
                        <label htmlFor='distributor_name'>Distributor Name</label>
                    </div>
                    <div className='col-md-3 inputs'>
                        <input type="text" id='distributor_name' name="distributor_name" value={formData.distributor_name} onChange={handleChange} /> <br/>
                        <button type='submit' disabled={disabled}>Submit</button>
                    </div>
                </div>

            </form>
        </main>
    )
}

export default NewDistributor