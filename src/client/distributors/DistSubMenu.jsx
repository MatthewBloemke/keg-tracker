import React from 'react'
import { Link } from 'react-router-dom'

const DistSubMenu = () => {
    return (
        <ul>
            <li>
                <Link to="/distributors">View Distributors</Link>
            </li>
            <li>
                <Link to="/distributors/new">New Distributor</Link>
            </li>
            <li>
                <Link to="/distributors/edit">Edit Distributor</Link>
            </li>
        </ul>
    )
}

export default DistSubMenu;