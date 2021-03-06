import React from 'react'
import { Link } from 'react-router-dom';
import {IconButton} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';
import {DataGrid} from '@mui/x-data-grid'

const FormatReturnedKegs = ({kegs}) => {
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
        {field: "date_shipped", headerName: "Date Returned", minWidth: 180, flex: 1},
        {field: "editButton", headerName: "", minWidth: 70, renderCell: renderEditButton, sortable: false, flex: 1}
    ];
    kegs.forEach(keg => {
        const today = new Date(Date.now());
        today.setHours(0,0,0,0)
        const date_shipped = new Date(keg.date_shipped)
        date_shipped.setHours(0,0,0,0)
        const month = String(date_shipped.getMonth() + 1)
        const day = String(date_shipped.getDate())
        kegTableRows.push(
            {
                id: keg.keg_id,
                keg_name: keg.keg_name,
                keg_size: keg.keg_size,
                date_shipped: `${("0"+month).slice(-2)}-${("0"+day).slice(-2)}-${date_shipped.getFullYear()}`,
                borderColor: 'black'
            }
        );
    });

    return (
        <DataGrid
            sx={{
                border: "none", 
                height: "100vh",
                paddingLeft: "15px",
                paddingRight: "15px",
                backgroundColor: '#f5f5f5'
            }}
            rows={kegTableRows}
            columns={columns}
            pageSize={50}
            rowsPerPageOptions={[50]}
        />

    )
}

export default FormatReturnedKegs