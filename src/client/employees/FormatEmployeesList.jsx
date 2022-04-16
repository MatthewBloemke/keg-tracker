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
        {field: 'employee_email', headerName: "Employee Username", minWidth: 150, flex: 1},
        {field: 'employee_name', headerName: "Employee Name", minWidth: 150, flex: 1},
        {field: 'admin', headerName: 'Admin', minWidth: 100, flex: 1},
        {field: " ", headerName: " ", minWidth: 80, flex: 1, renderCell: renderEditButton}
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
            sx={{
                border: "none",
                height: '100vh',
                paddingLeft: "15px",
                paddingRight: "15px",
                backgroundColor: '#f5f5f5'
            }}
            rows={employeeRows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
        />
    )
}

export default FormatEmployeesList;