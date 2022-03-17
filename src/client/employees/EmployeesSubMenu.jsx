import React from 'react'
import { Link } from 'react-router-dom'

const EmployeeSubMenu = () => {
    return (
        <ul>
            <li>
                <Link to="/employees">View Employees</Link>
            </li> 
            <li>
                <Link to="/employees/new">New Employee</Link>
            </li>
        </ul>
    )
}

export default EmployeeSubMenu;