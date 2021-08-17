import React from 'react'
import { Link } from 'react-router-dom'

const ShippingSubMenu = () => {
    return (
        <ul>
            <li><Link to="/shipping">Daily Report</Link></li>
            <li><Link to="/shipping/monthly">Monthly Report</Link></li>
        </ul>
    )
}

export default ShippingSubMenu;