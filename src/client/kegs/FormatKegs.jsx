import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import "./ListKegs.css"

const FormatKegs = ({kegs, distributors}) => {
    const kegTable = []
    kegs.forEach(keg => {
        const path=`/kegs/edit/${keg.keg_id}`
        const distributor = distributors.find(({distributor_id}) => distributor_id === keg.shipped_to)
        kegTable.push(
            <tr key ={keg.keg_id}>
                <td>{keg.keg_name}</td>
                <td>{keg.keg_size}</td>
                <td>{keg.keg_status}</td>
                <td>{keg.date_shipped}</td>
                <td>{distributor ? distributor.distributor_name : null}</td>
                <td><Link to={path}><button className='btn btn-primary' id={keg.keg_id}>Edit</button></Link></td>
            </tr>
        )
    })
    return (
        <table>
            <thead>
                <tr>
                    <th >Keg Number</th>
                    <th >Keg Size</th>
                    <th >Keg Status</th>
                    <th >Date Shipped</th>
                    <th >Distributor</th>                 
                </tr>
            </thead>
            <tbody>
                {kegTable}
            </tbody>            
        </table>

    )
}

export default FormatKegs