import React from 'react'
import { Link } from 'react-router-dom';
import {IconButton} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';
import {DataGrid} from '@mui/x-data-grid'

const FormatShippedKegs = ({kegs, distributors, status}) => {
    const renderEditButton = (params) => {
        return (
            <strong>
                <IconButton className='editButton' component={Link} to={`/kegs/edit/${params.row.id}`}><EditIcon/></IconButton>
            </strong>
        )
    }

    const kegTableRows = [];
    const columns = [
        {field: "keg_name", headerName: "Keg Number", minWidth: 140, flex: 1},
        {field: "keg_size", headerName: "Keg Size", minWidth: 100, flex: 1},
        {field: "date_shipped", headerName: "Date Shipped", minWidth: 180, flex: 1},
        {field: "days_out", headerName: "Days Out", minWidth: 120, flex: 1},
        {field: "distributor", headerName: "Distributor", minWidth: 180, flex: 1},
        {field: "editButton", headerName: "", minWidth: 70, renderCell: renderEditButton, sortable: false, flex: 1}
    ];
    kegs.forEach(keg => {
        const current_distributor = distributors.find(({distributor_id}) => distributor_id === keg.shipped_to)
        const today = new Date(Date.now());
        today.setHours(0,0,0,0)
        const date_shipped = new Date(keg.date_shipped)
        date_shipped.setHours(0,0,0,0)
        const month = String(date_shipped.getMonth() + 1)
        const day = String(date_shipped.getDate())
        const timeDifference = today.getTime() - date_shipped.getTime()
        const keg_days_out = timeDifference/1000/3600/24;
        kegTableRows.push(
            {
                id: keg.keg_id,
                keg_name: keg.keg_name,
                keg_size: keg.keg_size,
                date_shipped: `${("0"+month).slice(-2)}-${("0"+day).slice(-2)}-${date_shipped.getFullYear()}`,
                days_out: status === "shipped" ? Math.floor(keg_days_out) : null,
                distributor: current_distributor ? current_distributor.distributor_name : null
            }
        );
    });

    return (
        <DataGrid
            sx={{border: "none", height: "100vh", marginLeft: "15px"}}
            rows={kegTableRows}
            columns={columns}
            pageSize={50}
            rowsPerPageOptions={[50]}z
        />

    )
}

export default FormatShippedKegs