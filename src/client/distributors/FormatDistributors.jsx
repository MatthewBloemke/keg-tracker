import React, { useState } from 'react'
import { Link } from 'react-router-dom';

const FormatDistributors = ({distributors}) => {
    const distTable = [];
    console.log(distributors)
    distributors.forEach(dist => {
        const path = `/distributors/edit/${dist.distributor_id}`
        distTable.push(
            <tr key = {dist.distributor_id}>
                <td>{dist.distributor_name}</td>
                <td><Link to={path}><button id={dist.distributor_id}>Edit</button></Link></td>
            </tr>
        )
    })
    return (
        <table>
            <thead>
                <tr>
                    <th>Distributor Name</th>
                </tr>
            </thead>
            <tbody>
                {distTable}
            </tbody>
        </table>
    )
}

export default FormatDistributors;