import React from 'react'
import {Fab, Typography} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';

const FormatKegIdList = ({kegIds, onDelete}) => {
    const formattedList = []
    kegIds.forEach(id => {
        const tempId = id[0].length === 4 ? id[0]: id;
        formattedList.push(
            <Typography key={tempId} variant='h5' component='div'>
                {tempId + "   "}
                <Fab size='small' aria-label='delete' color='error' name={tempId} onClick={onDelete}><DeleteIcon/></Fab>
            </Typography>

        )
    })
    return formattedList
}

export default FormatKegIdList;