import React, {useEffect, useState} from 'react';
import { createFlavor, isAdmin } from "../utils/api";
import { TextField, Alert, Grid, Button } from "@mui/material";
import { useHistory } from 'react-router-dom';

const NewFlavor = () => {
    const initialFormState = {
        flavor_name: "",
        kegs_filled: 0
    };

    const history = useHistory();

    const [formData, setFormData] = useState(initialFormState);
    const [disabled, setDisabled] = useState(true);
    const [error, setError] = useState(null);
    const [alert, setAlert] = useState(null);

    const handleChange = ({target}) => {
        if (target.value.length > 0) {
            setDisabled(false);
        } else {
            setDisabled(true);
        };
        setFormData({
            ...formData,
            [target.name]: target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const controller = new AbortController();

        if (formData.flavor_name.length === 0) {
            setError("Please enter a name");
        } else {
            await createFlavor(formData, controller.signal)
                .then(response => {
                    if (response.error) {
                        setError(response.error);
                    } else {
                        setFormData(initialFormState);
                        setAlert(`Flavor ${formData.flavor_name} successfully created`);                   
                    };
                });
        };
    };

    useEffect(() => {
        const abortController = new AbortController();

        const adminCheck = async () => {
            await isAdmin(abortController.signal)
                .then(response => {
                    if (!response) {
                        history.push('/kegs/track');
                        return () => {
                            abortController.abort();
                        };
                    };
                });
        };

        adminCheck();

        return () => abortController.abort();
    }, []);

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Grid container alignItems="center" direction="column">
                    <TextField sx={{width: "10%", minWidth: "250px", mb: "20px"}} id="outlined-basic" label="Flavor Name" name='flavor_name' onChange={handleChange} value={formData.flavor_name} />
                    <Button onClick={handleSubmit} size="large" variant="contained" disabled={disabled}>Submit</Button> <br/>
                </Grid>
            </Grid>
            <Grid item xs={12} >
                <Grid container justifyContent="center" spacing={1}>
                    {error ? <Alert onClose={() => {setError(null)}} sx={{minWidth: "250px", width: "30%", margin: "auto", marginTop: "20px"}} variant="filled" severity="error">{error}</Alert>: null}
                    {alert ? <Alert onClose={() => {setAlert(null)}} sx={{minWidth: "250px", width: "30%", margin: "auto", marginTop: "20px"}} variant="filled" severity="success">{alert}</Alert>: null}
                </Grid>
            </Grid>
        </Grid>
    );
};

export default NewFlavor;