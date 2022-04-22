import React from 'react';
import { Link } from 'react-router-dom';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

const FlavorsSubMenu = ({closeDrawer}) => {
    const style = {
        paddingLeft: "20px"
    };

    return (
        <List sx={style} component="nav">
            <ListItemButton onClick={closeDrawer} component={Link} to="/flavors">
                <ListItemText primary="View Flavors"/>
            </ListItemButton>
            <Divider/>
            <ListItemButton onClick={closeDrawer} component={Link} to="/flavors/new">
                <ListItemText primary="New Flavor"/>
            </ListItemButton>
        </List>
    );
};

export default FlavorsSubMenu;