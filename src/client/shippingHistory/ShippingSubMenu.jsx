import React from 'react'
import { Link } from 'react-router-dom'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

const ShippingSubMenu = () => {
    const style = {
        width: '100%',
        bgcolor: '#1675d1',
        color: "#ffffff",
        paddingLeft: "20px"
    }
    return (
        <List sx={style} component="nav">
            <ListItem button component={Link} to="/shipping">
                <ListItemText primary="Daily Report"/>
            </ListItem>
            <Divider/>
            <ListItem button component={Link} to="/shipping/monthly">
                <ListItemText primary="Monthly Report"/>
            </ListItem>
            <Divider/>
        </List>
    )
}

export default ShippingSubMenu;