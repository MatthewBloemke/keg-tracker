import React from 'react'
import { Link } from 'react-router-dom';
import { IconButton} from '@mui/material'
import {DataGrid} from '@mui/x-data-grid'
import EditIcon from '@mui/icons-material/Edit'

const FormatDistributors = ({distributors}) => {    
    const renderEditButton = (params) => {
        return (
            <div style={{display: 'flex', flexWrap: 'wrap'}}>
                <IconButton className="editButton" component={Link} to={`/distributors/edit/${params.row.id}`}><EditIcon/></IconButton>
                <p style={{marginTop: '15px', marginLeft: '4px'}}> {params.row.distributor_name}</p>
            </div>
            
            )
    }
    const distTable = [];
    const columns = [
        {field: "distributor_name", headerName: "Distributor Name", width: 220, renderCell: renderEditButton},
        {field: "ave_days_out", headerName: "Average Turn Over Time", width: 180}
    ]



    distributors.forEach(dist => {
        const path = `/distributors/edit/${dist.distributor_id}`
        distTable.push(
            {
                id: dist.distributor_id,
                distributor_name: dist.distributor_name,
                ave_days_out: dist.days_out_arr ? dist.days_out_arr.reduce((a,b) => a + b) / dist.days_out_arr.length : null
            }
        )
    })
    return (
        <DataGrid
            rows={distTable}
            columns={columns}
            pageSize={25}
            rowsPerPageOptions={[25]}
            sx={{backgroundColor: 'white', width: '70%', height: '100vh'}}
        />
    )
}

export default FormatDistributors;