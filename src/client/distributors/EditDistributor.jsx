import React, {useEffect, useState} from 'react'
import { useParams, useHistory } from 'react-router-dom';
import { editDistributor, readDistributor } from '../utils/api'
import { useMediaQuery, TextField, Alert, Grid, Button, Divider, AppBar, Typography} from '@mui/material'
import { useTheme } from "@mui/material/styles";
import { isAdmin } from '../utils/api';

const EditDistributor = () => {
    const initialFormState = {
        distributor_name: ""
    };
    
    const history = useHistory()
    const params = useParams()
    const [formData, setFormData] = useState(initialFormState);
    const [disabled, setDisabled] = useState(true)
    const [error, setError] = useState(null);
    const [alert, setAlert] = useState(null);

    const theme = useTheme();
    const smallScreen = (!useMediaQuery(theme.breakpoints.up('sm')))

    const handleChange = ({target}) => {
        if (target.value.length > 0) {
            setDisabled(false)
        } else {
            setDisabled(true)
        }
        setFormData({
            ...formData,
            [target.name]: target.value
        })
    }
    const handleSubmit = async (event) => {
        event.preventDefault();
        const abortController = new AbortController();

        if (formData.distributor_name.length === 0) {
            setError("Name cannot be empty")
        } else {
            await editDistributor(formData, params.distributor_id, abortController.signal)
                .then(response => {
                    if (response.error) {
                        setError(response.error)
                    } else {
                        setAlert("Distributor successfully updated")
                        setFormData(initialFormState)
                    }
                })
        }
    }

    useEffect(() => {
        const abortController = new AbortController();
        const loadDistributor = async () => {
            await readDistributor(params.distributor_id, abortController.signal)
                .then((response) => {
                    if (response.error) {
                        setError(response.error)
                    } else {
                        setFormData({
                            ...formData,
                            distributor_name: response.distributor_name
                        })                        
                    }

                })
        }
        const adminCheck = async () => {
            await isAdmin(abortController.signal)
                .then(response => {
                    console.log("sent")
                    if (!response) {
                        console.log(response)
                        history.push('/kegs/track')
                        return () => {
                            abortController.abort()
                        };
                    } else {
                        console.log("user is an admin")
                    }
                })
        }
        adminCheck()
        loadDistributor();
        return () => abortController.abort()
    }, [])

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Divider/>
                <AppBar position='static'>
                    <Typography variant='h5' component='div' textAlign={smallScreen ? "center" : null} sx={{flexGrow: 1, pl: '10px', pb: '10px', pt: '10px'}}>
                        Edit Distributor
                    </Typography>
                </AppBar>
            </Grid>
            <Grid item xs={12}>
                <Grid container alignItems="center" direction="column">
                    <TextField sx={{width: "10%", minWidth: "250px", mb: '20px'}} id="outlined-basic" label="Distributor name" name='distributor_name' onChange={handleChange} value={formData.distributor_name} />
                    <Button onClick={handleSubmit} size="large" variant="contained" disabled={disabled} >Submit</Button> <br/>
                </Grid>
                
            </Grid>
            <Grid item xs={12} >
                <Grid container justifyContent="center" spacing={1}>
                    {error ? <Alert onClose={() => {setError(null)}} sx={{width: "30%", minWidth: "250px", margin: "auto", marginTop: "20px"}} variant="filled" severity="error">{error}</Alert>: null}
                    {alert ? <Alert onClose={() => {setAlert(null)}} sx={{width: "30%", minWidth: "250px", margin: "auto", marginTop: "20px"}} variant="filled" severity="success">{alert}</Alert>: null}
                </Grid>
            </Grid>
        </Grid>
    )  
}

export default EditDistributor;