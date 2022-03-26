import React from 'react'
import { Link } from 'react-router-dom';
import {IconButton} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';
import {DataGrid} from '@mui/x-data-grid'

import "./ListKegs.css"

const FormatKegs = ({kegs, distributors, status}) => {
    const renderEditButton = (params) => {
        return (
            <strong>
                <IconButton className='editButton' component={Link} to={`/kegs/edit/${params.row.id}`}><EditIcon/></IconButton>
            </strong>
        )
    }

    const kegTableRows = [];
    const columns = [
        {field: "keg_name", headerName: "Keg Number", width: 140},
        {field: "keg_size", headerName: "Keg Size", width: 100},
        {field: "keg_status", headerName: "Keg Status", width: 160, sortable: false},
        {field: "date_shipped", headerName: "Date Shipped", width: 180},
        {field: "days_out", headerName: "Days Out", width: 120},
        {field: "distributor", headerName: "Distributor", width: 180},
        {field: "editButton", headerName: "", width: 70, renderCell: renderEditButton, sortable: false}
    ];
    kegs.forEach(keg => {
        const current_distributor = distributors.find(({distributor_id}) => distributor_id === keg.shipped_to)
        const today = new Date(Date.now());
        today.setHours(0,0,0,0)
        console.log(keg.date_shipped)
        const date_shipped = new Date(keg.date_shipped)
        date_shipped.setHours(0,0,0,0)
        const month = String(date_shipped.getMonth() + 1)
        const day = String(date_shipped.getDate())
        console.log(day)
        const timeDifference = today.getTime() - date_shipped.getTime()
        const keg_days_out = timeDifference/1000/3600/24;
        console.log(date_shipped)
        kegTableRows.push(
            {
                id: keg.keg_id,
                keg_name: keg.keg_name,
                keg_size: keg.keg_size,
                keg_status: keg.keg_status,
                date_shipped: `${("0"+month).slice(-2)}-${("0"+day).slice(-2)}-${date_shipped.getFullYear()}`,
                days_out: status === "shipped" ? Math.floor(keg_days_out) : null,
                distributor: current_distributor ? current_distributor.distributor_name : null
            }
        );
    });

    return (
        <DataGrid
            rows={kegTableRows}
            columns={columns}
            pageSize={50}
            rowsPerPageOptions={[50]}
            sx={{backgroundColor: 'white', width: '70%', height: '100vh'}}
        />
    )
}

export default FormatKegs