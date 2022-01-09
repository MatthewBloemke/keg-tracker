import React, { useState } from 'react'
import { Link } from 'react-router-dom';

const FormatKegs = ({kegs, distributors}) => {
    const kegTable = []
    console.log(distributors)
    kegs.forEach(keg => {
        const path=`/kegs/edit/${keg.keg_id}`
        console.log(keg)
        const distributor = distributors.find(({distributor_id}) => distributor_id === keg.shipped_to)
        console.log(distributor)
        kegTable.push(
            <tr key ={keg.keg_id}>
                <td>{keg.keg_name}</td>
                <td>{keg.keg_size}</td>
                <td>{keg.keg_status}</td>
                <td>{keg.date_shipped}</td>
                <td>{distributor ? distributor.distributor_name : null}</td>
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