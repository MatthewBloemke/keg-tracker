import React from 'react'
import {DataGrid} from '@mui/x-data-grid'
import { standardizeDate } from '../utils/api'

const FormatFilling = ({date, monthlyOnly, fillingList, kegs, flavors}) => {
    date.setHours(0,0,0,0)
    const month = date.getUTCMonth()
    const year = date.getYear()
    const day = date.getDate()
    const fillingListRows = []
    console.log(flavors)
    const columns = [
        {field: "date_filled", headerName: "Date Filled", minWidth: 130, flex: 1},
        {field: "keg_name", headerName: "Keg Number", minWidth: 130, flex: 1},
        {field: "flavor_name", headerName: "Flavor", minWidth: 130, flex: 1},
        {field: "employee_email", headerName: "Employee", minWidth: 150, flex: 1}
    ]
    fillingList.forEach(async (entry) => {
        const current_flavor = flavors.find(({flavor_id}) => flavor_id === entry.flavor_id)
        const current_keg = kegs.find(({keg_id}) => keg_id === entry.keg_id) 
        const utcDate = standardizeDate(entry.date_filled)
        const tempDate = new Date(Date.UTC(utcDate.year, utcDate.month - 1, utcDate.day, 5));
        const tempMonth = String(tempDate.getMonth() + 1);
        const tempDay = String(tempDate.getDate());
        if (monthlyOnly) {
            if (tempDate.getMonth() === month && tempDate.getYear() === year) {
                fillingListRows.push(
                    {
                        id: entry.filling_id,
                        date_filled: `${("0"+tempMonth).slice(-2)}-${("0"+tempDay).slice(-2)}-${tempDate.getUTCFullYear()}`,
                        keg_name: current_keg ? current_keg.keg_name : null,
                        flavor_name: current_flavor ? current_flavor.flavor_name : null,
                        employee_email: entry.employee_email
                    }
                )
            }
        } else {
            if (tempDate.getMonth() === month && tempDate.getDate() === day && tempDate.getYear() === year) {
                fillingListRows.push(
                    {
                        id: entry.filling_id,
                        date_filled: `${("0"+tempMonth).slice(-2)}-${("0"+tempDay).slice(-2)}-${tempDate.getFullYear()}`,
                        keg_name: current_keg ? current_keg.keg_name : null,
                        flavor_name: current_flavor ? current_flavor.flavor_name : null,
                        employee_email: entry.employee_email
                    }
                )
            }
        }
    })
    return (
        <DataGrid
            rows={fillingListRows}
            columns={columns}
            pageSize={50}
            rowsPerPageOptions={[50]}
            sx={{
                border: "none",
                height: '100vh',
                paddingLeft: "15px",
                paddingRight: "15px",
                backgroundColor: '#f5f5f5'
            }}
        />
    )
}

export default FormatFilling;