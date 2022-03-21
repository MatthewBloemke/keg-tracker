import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {IconButton} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';

import "./ListKegs.css"

const FormatKegs = ({kegs, distributors}) => {
    const kegTable = [];
    kegs.forEach(keg => {
        const path=`/kegs/edit/${keg.keg_id}`
        const distributor = distributors.find(({distributor_id}) => distributor_id === keg.shipped_to)
        kegTable.push(
            <TableRow
            key={keg.keg_id}
            sx={{ '&:last-child td, &:last-child th': {border: 0}}}
        >
            <TableCell component="th" scope="row">

                <IconButton className='editButton' component={Link} to={path}><EditIcon/></IconButton> {keg.keg_name}
            </TableCell>
            <TableCell>{keg.keg_size}</TableCell>
            <TableCell>{keg.keg_status}</TableCell>
            <TableCell>{keg.date_shipped}</TableCell>
            <TableCell>{distributor ? distributor.distributor_name : null}</TableCell>
        </TableRow>
        )
    })

    return (
        <TableContainer className='tableContainer' component={Paper}>
            <Table sx={{ width: "80%" }}>
                <TableHead>
                    <TableRow>
                        <TableCell>Keg Number</TableCell>
                        <TableCell>Keg Size</TableCell>
                        <TableCell>Keg Status</TableCell>
                        <TableCell>Date Shipped</TableCell>
                        <TableCell>Distributor</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {kegTable}
                </TableBody>
            </Table>
        </TableContainer>
    )
    // kegs.forEach(keg => {
    //     const path=`/kegs/edit/${keg.keg_id}`
    //     const distributor = distributors.find(({distributor_id}) => distributor_id === keg.shipped_to)
    //     kegTable.push(
    //         <tr key ={keg.keg_id}>
    //             <td>{keg.keg_name}</td>
    //             <td>{keg.keg_size}</td>
    //             <td>{keg.keg_status}</td>
    //             <td>{keg.date_shipped}</td>
    //             <td>{distributor ? distributor.distributor_name : null}</td>
    //             <td><Link to={path}><button className='btn btn-primary' id={keg.keg_id}>Edit</button></Link></td>
    //         </tr>
    //     )
    // })
    // return (
    //     <table>
    //         <thead>
    //             <tr>
    //                 <th >Keg Number</th>
    //                 <th >Keg Size</th>
    //                 <th >Keg Status</th>
    //                 <th >Date Shipped</th>
    //                 <th >Distributor</th>                 
    //             </tr>
    //         </thead>
    //         <tbody>
    //             {kegTable}
    //         </tbody>            
    //     </table>

    // )
}

export default FormatKegs