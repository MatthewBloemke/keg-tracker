import React from 'react'
import {Fab} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';

const FormatKegIdList = ({kegIds, onDelete}) => {
    const formattedList = []
    kegIds.forEach(id => {
        const tempId = id[0].length === 4 ? id[0] + "  " : id + "  ";
        formattedList.push(
            <p style={{backgroundColor: "#E1E2E1"}} key={tempId} className='kegId'>
                {tempId}
                <Fab xs={{marginLeft: '10px'}} size='small' aria-label='delete' color='error' name={tempId} onClick={onDelete}><DeleteIcon/></Fab>
            </p>
        )
    })
    return formattedList
}

export default FormatKegIdList;