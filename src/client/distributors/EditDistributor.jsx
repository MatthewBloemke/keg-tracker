import React, {useEffect, useState} from 'react'
import { useHistory, useParams } from 'react-router';
import { editDistributor, readDistributor } from '../utils/api'

const EditDistributor = () => {
    const history = useHistory()

    const initialFormState = {
        distributor_name: ""
    };
    
    const params = useParams()
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
        console.log(formData)
        const abortController = new AbortController();

        if (formData.distributor_name.length === 0) {
            //set an error message to display here
        } else {
            await editDistributor(formData, params.distributor_id, abortController.signal)
            setFormData(initialFormState)
            history.push("/distributors")
        }
    }

    useEffect(() => {
        const abortController = new AbortController();
        const loadDistributor = async () => {
            await readDistributor(params.distributor_id, abortController.signal)
                .then((response) => {
                    setFormData({
                        ...formData,
                        distributor_name: response.distributor_name
                    })
                })
        }
        loadDistributor();
        return () => abortController.abort()
    }, [])

    return (
        <main>
            <h1>Edit Distributor</h1>
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

export default EditDistributor;