import React from 'react'
import {DataGrid} from '@mui/x-data-grid'

const FormatShipping = ({date, monthlyOnly, shippingList, kegs, distributors}) => {
    date.setHours(0,0,0,0)
    const month = date.getUTCMonth()
    const year = date.getYear()
    const day = date.getUTCDay()
    const shippingListRows = []
    console.log(date, "prop")
    const columns = [
        {field: "date_shipped", headerName: "Date Shipped", minWidth: 130, flex: 1},
        {field: "keg_name", headerName: "Keg Number", minWidth: 130, flex: 1},
        {field: "distributor_name", headerName: "Distributor", minWidth: 130, flex: 1},
        {field: "employee_email", headerName: "Employee", minWidth: 150, flex: 1}
    ]
    shippingList.forEach(async (entry) => {
        console.log(entry.date_shipped, "database date")
        const current_distributor = distributors.find(({distributor_id}) => distributor_id === entry.distributor_id)
        const current_keg = kegs.find(({keg_id}) => keg_id === entry.keg_id) 
        const tempDate = new Date(entry.date_shipped);
        console.log(tempDate, "javascript date object")
        tempDate.setHours( tempDate.getHours + 5)
        const tempMonth = String(tempDate.getUTCMonth() + 1);
        const tempDay = String(tempDate.getUTCDate());
        if (monthlyOnly) {
            if (tempDate.getUTCMonth() === month && tempDate.getYear() === year) {
                shippingListRows.push(
                    {
                        id: entry.shipping_id,
                        date_shipped: `${("0"+tempMonth).slice(-2)}-${("0"+tempDay).slice(-2)}-${tempDate.getUTCFullYear()}`,
                        keg_name: current_keg ? current_keg.keg_name : null,
                        distributor_name: current_distributor ? current_distributor.distributor_name : null,
                        employee_email: entry.employee_email
                    }
                )
            }
        } else {
            if (tempDate.getUTCMonth() === month && tempDate.getUTCDay() === day && tempDate.getYear() === year) {
                shippingListRows.push(
                    {
                        id: entry.shipping_id,
                        date_shipped: `${("0"+tempMonth).slice(-2)}-${("0"+tempDay).slice(-2)}-${tempDate.getUTCFullYear()}`,
                        keg_name: current_keg ? current_keg.keg_name : null,
                        distributor_name: current_distributor ? current_distributor.distributor_name : null,
                        employee_email: entry.employee_email
                    }
                )
            }
        }
    })
    return (
        <DataGrid
            rows={shippingListRows}
            columns={columns}
            pageSize={50}
            rowsPerPageOptions={[50]}
            sx={{height: '100vh'}}
        />
    )
}

export default FormatShipping;