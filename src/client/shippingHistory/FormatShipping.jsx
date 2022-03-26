import React from 'react'
import {DataGrid} from '@mui/x-data-grid'
/**
 * TODO: 
 * add buttons to change month and day
 * 
 */
const FormatShipping = ({date, monthlyOnly, shippingList, kegs, distributors}) => {
    const abortController = new AbortController();
    const month = date.getMonth()
    const year = date.getYear()
    const day = date.getDay()
    const shippingListRows = []
    const columns = [
        {field: "date_shipped", headerName: "Date Shipped", width: 130},
        {field: "keg_name", headerName: "Keg Number", width: 130},
        {field: "distributor_name", headerName: "Distributor", width: 130},
        {field: "employee_email", headerName: "Employee", width: 150}
    ]
    shippingList.forEach(async (entry) => {
        const current_distributor = distributors.find(({distributor_id}) => distributor_id === entry.distributor_id)
        const current_keg = kegs.find(({keg_id}) => keg_id === entry.keg_id) 
        const tempDate = new Date(entry.date_shipped);
        const tempMonth = String(tempDate.getMonth() + 1);
        const tempDay = String(tempDate.getDate());
        if (monthlyOnly) {
            if (tempDate.getMonth() === month && tempDate.getYear() === year) {
                console.log(tempDate.getYear())
                shippingListRows.push(
                    {
                        id: entry.shipping_id,
                        date_shipped: `${("0"+tempMonth).slice(-2)}-${("0"+tempDay).slice(-2)}-${tempDate.getFullYear()}`,
                        keg_name: current_keg ? current_keg.keg_name : null,
                        distributor_name: current_distributor ? current_distributor.distributor_name : null,
                        employee_email: entry.employee_email
                    }
                )
            }
        } else {
            if (tempDate.getMonth() === month && tempDate.getDay() === day && tempDate.getYear() === year) {
                shippingListRows.push(
                    {
                        id: entry.shipping_id,
                        date_shipped: `${("0"+tempMonth).slice(-2)}-${("0"+tempDay).slice(-2)}-${tempDate.getFullYear()}`,
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
            sx={{backgroundColor: 'white', width: '70%', height: '100vh'}}
        />
    )
}

export default FormatShipping;