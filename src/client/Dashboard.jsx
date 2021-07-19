import React from 'react'
import {isLoggedIn} from './utils/api'

const Dashboard = () => {
    isLoggedIn()
    return (
        <div>
            <h1>This is the dashboard</h1>
        </div>
    )
}

export default Dashboard