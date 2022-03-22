import React, {useEffect, useState} from 'react'
import { useHistory, useParams } from 'react-router-dom';
import { editDistributor, readDistributor } from '../utils/api'
import {FormControl, TextField, Alert, Grid, Button, Select, MenuItem, InputLabel} from '@mui/material'

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
        <Grid container spacing={3}>
            <Grid xs={12}>
                <h1>Edit Distributor</h1>
            </Grid>
        </Grid>
    )  
}

export default EditDistributor;