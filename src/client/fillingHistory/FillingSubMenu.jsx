import React from 'react'
import { Link } from 'react-router-dom'
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { ListItemButton } from '@mui/material';

const FillingSubMenu = ({closeDrawer}) => {
    const style = {
        paddingLeft: "20px"
    }
    return (
        <List sx={style} component="nav">
            <ListItemButton onClick={closeDrawer} component={Link} to="/filling">
                <ListItemText primary="Daily Report"/>
            </ListItemButton>
            <Divider/>
            <ListItemButton onClick={closeDrawer} component={Link} to="/filling/monthly">
                <ListItemText primary="Monthly Report"/>
            </ListItemButton>
        </List>
    )
}

export default FillingSubMenu;