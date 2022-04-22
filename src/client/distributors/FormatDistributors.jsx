import React from 'react';
import { Link } from 'react-router-dom';
import { IconButton} from '@mui/material';
import {DataGrid} from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';

const FormatDistributors = ({distributors, kegs}) => {    
    const renderEditButton = (params) => {
        return (
            <div style={{display: 'flex', flexWrap: 'wrap'}}>
                <IconButton className="editButton" component={Link} to={`/distributors/edit/${params.row.id}`}><EditIcon/></IconButton>
            </div>
            );
    };

    const distTable = [];
    const distKegs = [];

    const columns = [
        {field: "distributor_name", headerName: "Distributor Name", minWidth: 220, flex: 1},
        {field: "ave_days_out", headerName: "Average Turn Over Time", minWidth: 180, flex: 1},
        {field: "total_kegs_shipped", headerName: "Total Kegs Shipped", minWidth: 180, flex: 1},
        {field: "kegs_rented", headerName: "Total Kegs Being Used", minWidth: 180, flex: 1},
        {field: "editButton", headerName: "", minWidth: 70, renderCell: renderEditButton, sortable: false, flex: 1}
    ];

    kegs.forEach((keg) => {
        const current_distributor = distributors.find(({distributor_id}) => distributor_id === keg.shipped_to);
        
        if (current_distributor) {
            const {distributor_name} = current_distributor;
            if (!distKegs[distributor_name]) {
                distKegs[distributor_name] = 1;
            } else {
                distKegs[distributor_name]++;
            };
        };
    });

    distributors.forEach(dist => {
        distTable.push(
            {
                id: dist.distributor_id,
                distributor_name: dist.distributor_name,
                ave_days_out: dist.days_out_arr ? `${dist.days_out_arr.reduce((a,b) => a + b) / dist.days_out_arr.length} days` : null,
                total_kegs_shipped: dist.days_out_arr ? `${dist.days_out_arr.length} kegs` : null,
                kegs_rented: `${distKegs[dist.distributor_name] > 0 ? distKegs[dist.distributor_name] : 0} kegs`
            }
        );
    });

    return (
        <DataGrid
            sx={{
                border: "none",
                height: '100vh',
                paddingLeft: "15px",
                paddingRight: "15px",
                backgroundColor: '#f5f5f5'
            }}
            rows={distTable}
            columns={columns}
            pageSize={25}
            rowsPerPageOptions={[25]}
        />
    );
};

export default FormatDistributors;