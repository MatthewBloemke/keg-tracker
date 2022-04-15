import React from 'react';
import { Link } from 'react-router-dom';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { ListItemButton } from '@mui/material';

const KegSubMenu = ({closeDrawer}) => {

    const style = {
        paddingLeft: "25px"
    }
    return (
        <List sx={style} component="nav">
            <ListItemButton onClick={closeDrawer} component={Link} to="/kegs/list/shipped">
                <ListItemText primary="View Shipped Kegs"/>
            </ListItemButton>
            <Divider/>
            <ListItemButton onClick={closeDrawer} component={Link} to="/kegs/list/returned">
                <ListItemText primary="View Returned Kegs"/>
            </ListItemButton>
            <Divider/>
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

export default KegSubMenu;