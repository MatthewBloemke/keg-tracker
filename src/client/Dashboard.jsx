import React, { useEffect, useState } from 'react'
import {getKegs, isLoggedIn} from './utils/api'

const Dashboard = () => {
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
    const abortController = new AbortController()
    isLoggedIn(abortController.signal)
    const [kegs, setKegs] = useState(null)
    useEffect(async () => {
        console.log("why wont this fucking work")
        await fetch(`${API_BASE_URL}/api/kegs`)
        .then(response => response.json())
        .then(data => setKegs(data.data))  
    }, [])    
    return (
        <div>
            <h1>This is the dashboard</h1>
            <p>Total Kegs</p>
            <p>Kegs in house</p>
            <p>Total shipped kegs</p>
            <p>0-60 Days</p>
            <p>60-120 Days</p>
            <p>120+ Days</p>
            <p>{kegs ? kegs[0].keg_size : null}</p>
        </div>
    )
}

export default Dashboard