import React, { useState } from 'react'
import { Link } from 'react-router-dom';

const FormatKegs = ({kegs, filter}) => {
    const [filteredKegs, setFilteredKegs] = useState(kegs);
    const kegTable = []
    kegs.forEach(keg => {
        const path=`/kegs/edit/${keg.keg_id}`
        kegTable.push(
            <tr key ={keg.keg_id}>
                <td>{keg.keg_name}</td>
                <td>{keg.keg_size}</td>
                <td>{keg.keg_status}</td>
                <td>{keg.date_shipped}</td>
                <td>{keg.shipped_to}</td>
                <td><Link to={path}><button id={keg.keg_id}>Edit</button></Link></td>
            </tr>
        )
    })
    return (
        <table>
            <thead>
                <tr>
                    <th>Keg Number</th>
                    <th>Keg Size</th>
                    <th>Keg Status</th>
                    <th>Date Shipped</th>
                    <th>Shipped_to</th>                 
                </tr>
            </thead>
            <tbody>
                {kegTable}
            </tbody>            
        </table>

    )
}

export default FormatKegs