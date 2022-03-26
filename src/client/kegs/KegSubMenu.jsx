import React from 'react';
import { Link } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

const KegSubMenu = () => {

    const style = {
        width: '100%',
        bgcolor: '#1675d1',
        color: "#ffffff",
        paddingLeft: "25px"
    }
    return (
        <List sx={style} component="nav">
            <ListItem button component={Link} to="/kegs/list/shipped">
                <ListItemText primary="View Shipped Kegs"/>
            </ListItem>
            <Divider/>
            <ListItem button component={Link} to="/kegs/list/returned">
                <ListItemText primary="View Returned Kegs"/>
            </ListItem>
            <Divider/>
            <ListItem button divider component={Link} to="/kegs/track">
                <ListItemText primary="Ship Kegs"/>
            </ListItem>
            <Divider/>
            <ListItem button divider component={Link} to="/kegs/return">
                <ListItemText primary="Return Kegs"/>
            </ListItem>
            <Divider/>
            <ListItem button component={Link} to="/kegs/new">
                <ListItemText primary="Create Kegs"/>
            </ListItem>
        </List>
    )
}

export default KegSubMenu;