import React from 'react'
import { Link } from 'react-router-dom'
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

const DistSubMenu = ({closeDrawer}) => {
    const style = {
        paddingLeft: "20px"
    }
    return (
        <List sx={style} component="nav">
            <ListItemButton onClick={closeDrawer} component={Link} to="/distributors">
                <ListItemText primary="View Distributors"/>
            </ListItemButton>
            <Divider/>
            <ListItemButton onClick={closeDrawer} component={Link} to="/distributors/new">
                <ListItemText primary="New Distributor"/>
            </ListItemButton>
        </List>
    )
}

export default DistSubMenu;