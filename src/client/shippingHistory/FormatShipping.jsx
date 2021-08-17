import React from 'react'
/**
 * TODO: 
 * add buttons to change month and day
 * 
 */
const FormatShipping = ({date, monthlyOnly, shippingList}) => {
    const month = date.getMonth()
    const day = date.getDay()
    const filteredShippingList = []
    shippingList.forEach((entry) => {
        const tempMonth = new Date(entry.date_shipped)
        if (monthlyOnly) {
            if (tempMonth.getMonth() === month) {
                filteredShippingList.push(
                    <tr key={entry.shipping_id}>
                        <td>{entry.date_shipped}</td>
                        <td>{entry.keg_name}</td>
                        <td>{entry.distributor_name}</td>
                        <td>{entry.employee_email}</td>
                    </tr>   
                )
            }
        } else {
            if (tempMonth.getMonth() === month && tempMonth.getDay() === day) {
                filteredShippingList.push(
                    <tr key={entry.shipping_id}>
                        <td>{entry.date_shipped}</td>
                        <td>{entry.keg_name}</td>
                        <td>{entry.distributor_name}</td>
                        <td>{entry.employee_email}</td>
                    </tr>   
                )
            }
        }
    })
    return (
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Keg Id</th>
                    <th>Distributor</th>
                    <th>Employee</th>
                </tr>
            </thead>
            <tbody>
                {filteredShippingList}
            </tbody>
        </table>
    )
}

export default FormatShipping;