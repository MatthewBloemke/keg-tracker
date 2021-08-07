import React, { useState } from 'react'

const FormatKegs = ({kegs, filter}) => {
    const [filteredKegs, setFilteredKegs] = useState(kegs);
    const kegTable = []
    kegs.forEach(keg => {
        kegTable.push(
            <tr key ={keg.keg_id}>
                <td>{keg.keg_name}</td>
                <td>{keg.keg_size}</td>
                <td>{keg.keg_status}</td>
                <td>{keg.date_shipped}</td>
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
                </tr>
            </thead>
            <tbody>
                {kegTable}
            </tbody>            
        </table>

    )
}

export default FormatKegs