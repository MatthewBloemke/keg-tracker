import React from 'react';
import { Link } from 'react-router-dom';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { ListItemButton } from '@mui/material';

const NonAdminSubMenu = ({closeDrawer}) => {

    const style = {
        paddingLeft: "25px"
    }
    return (
        <List sx={style} component="nav">
            <ListItemButton onClick={closeDrawer} component={Link} to="/kegs/track/environment">
                <ListItemText primary="Ship Kegs"/>
            </ListItemButton>
            <Divider/>
            <ListItemButton onClick={closeDrawer} component={Link} to="/kegs/return/environment">
                <ListItemText primary="Return Kegs"/>
            </ListItemButton>
            <Divider/>            
            <ListItemButton onClick={closeDrawer} component={Link} to="/kegs/fill/environment">
                <ListItemText primary="Fill Kegs"/>
            </ListItemButton>
            <Divider/>
            <ListItemButton onClick={closeDrawer} component={Link} to="/kegs/new">
                <ListItemText primary="Create Kegs"/>
            </ListItemButton>
        </List>
    )
}

export default NonAdminSubMenu;