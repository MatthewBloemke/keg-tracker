import React, { useEffect, useState } from 'react'
import {getKegs, isLoggedIn} from './utils/api'
import {useHistory} from 'react-router-dom'
import store from 'store'


const Dashboard = () => {   
    const history = useHistory()
    if (!store.get("loggedIn")) {
        history.push('/login')
    }

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
    const [kegs, setKegs] = useState([]) 
    const [returnedKegs, setReturnedKegs] = useState([])

    const loadDashboard = async () => {
        await getKegs(API_BASE_URL)
            // .then(response => {
            //     const tempKegs = response.data
            //     for (let i = 0; i < tempKegs.length; i++) {
            //         if (tempKegs[i])
            //     }
            // })
    }
    useEffect(() => {
        const loadKegs = async () => {
            // const response = await fetch(`${API_BASE_URL}/api/kegs`)
            // const result = await response.json()
            // console.log(result.data)
            const result = await getKegs(API_BASE_URL)
            setKegs(result)            
        }
        loadKegs()
    }, [])
    return (
        <div> 
            <h1>This is the dashboard</h1>
            <p>Total Kegs {kegs ? kegs.length : null}</p>
            <p>Kegs returned </p>
            <p>Total shipped kegs</p>
            <p>0-60 Days</p>
            <p>60-120 Days</p>
            <p>120+ Days</p>
            {/* <p>{kegs ? kegs[0].keg_size : null}</p> */}
        </div>
    )
}

export default Dashboard