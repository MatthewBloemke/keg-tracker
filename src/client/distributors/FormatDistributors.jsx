import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'

const FormatDistributors = ({distributors}) => {
    const distTable = [];
    distributors.forEach(dist => {
        const path = `/distributors/edit/${dist.distributor_id}`
        distTable.push(
            <TableRow
                key={dist.distributor_id}
                sx={{'&:last-child td, &:last-child th': {border: 0}}}
            >
                <TableCell align='center' component='th' scope="row">
                    <IconButton className="editButton" component={Link} to={path}><EditIcon/></IconButton> {dist.distributor_name}
                </TableCell>
            </TableRow>
        )
    })
    return (
        <TableContainer className="tableContainer" component={Paper}>
            <Table sx={{width: "80%"}}>
                <TableHead>
                    <TableRow>
                        <TableCell align='center'>Distributor Name</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {distTable}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default FormatDistributors;