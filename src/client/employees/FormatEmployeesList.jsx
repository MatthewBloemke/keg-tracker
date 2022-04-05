import React from "react";
import {Link} from 'react-router-dom'
import {IconButton} from '@mui/material'
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from '@mui/icons-material/Edit'

const FormatEmployeesList = ({employees}) => {
    const employeeRows = [];

    const renderEditButton = (params) => {
        return <IconButton component={Link} to={`/employees/edit/${params.row.id}`}><EditIcon/></IconButton>
    }

    const columns = [
        {field: 'employee_email', headerName: "Employee Username", width: 150},
        {field: 'employee_name', headerName: "Employee Name", width: 150},
        {field: 'admin', headerName: 'Admin', width: 100},
        {field: " ", headerName: " ", width: 80, renderCell: renderEditButton}
    ]

    employees.forEach(({employee_id, employee_email, employee_name, admin}) => {
        employeeRows.push(
            {
                id: employee_id,
                employee_email,
                employee_name,
                admin
            }
        )
    })

    return (
        <DataGrid
            rows={employeeRows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            sx={{backgroundColor: 'white', width: '70%', height: '100vh'}}
        />
    )
}

export default FormatEmployeesList;