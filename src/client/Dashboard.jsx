import React, { useEffect, useState } from 'react'
import {getKegs, isLoggedIn} from './utils/api'

require('react-dom');
window.React2 = require('react');
console.log(window.React1 === window.React2);

const Dashboard = () => {
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
    
    
    isLoggedIn()
    const [kegs, setKegs] = useState(null)

    const loadDashboard = async () => {
        console.log(await getKegs(API_BASE_URL))   
    }
    loadDashboard()
    useEffect(() => {
        const loadKegs = async () => {
            // const response = await fetch(`${API_BASE_URL}/api/kegs`)
            // const result = await response.json()
            // console.log(result.data)
            console.log("garbage")
            const result = await getKegs(API_BASE_URL)
            console.log("after result garbage")
            setKegs(result)            
        }
        loadKegs()
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