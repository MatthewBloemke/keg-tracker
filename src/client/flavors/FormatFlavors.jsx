import React from 'react'
import { Link } from 'react-router-dom';
import { IconButton} from '@mui/material'
import {DataGrid} from '@mui/x-data-grid'
import EditIcon from '@mui/icons-material/Edit'

const FormatFlavors = ({flavors}) => {    
    const renderEditButton = (params) => {
        return (
            <div style={{display: 'flex', flexWrap: 'wrap'}}>
                <IconButton className="editButton" component={Link} to={`/flavors/edit/${params.row.id}`}><EditIcon/></IconButton>
            </div>
            )
    }
    const flavorTable = [];
    const columns = [
        {field: "flavor_name", headerName: "Flavor Name", minWidth: 220, flex: 1},
        {field: "total_kegs_filled", headerName: "Total Kegs Filled", minWidth: 180, flex: 1},
        {field: "editButton", headerName: "", minWidth: 70, renderCell: renderEditButton, sortable: false, flex: 1}
    ]



    flavors.forEach(flavor => {
        flavorTable.push(
            {
                id: flavor.flavor_id,
                flavor_name: flavor.flavor_name,
                total_kegs_filled: flavor.kegs_filled
            }
        )
    })
    return (
        <div id="data" style={{height: '100vh'}}>
            <DataGrid
                rows={flavorTable}
                columns={columns}
                pageSize={25}
                rowsPerPageOptions={[25]}
            />            
        </div>

    )
}

export default FormatFlavors;