import React from 'react'
import { Link } from 'react-router-dom'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

const DistSubMenu = () => {
    const style = {
        width: '100%',
        bgcolor: '#1675d1',
        color: "#ffffff",
        paddingLeft: "20px"
    }
    return (
        <List sx={style} component="nav">
            <ListItem button component={Link} to="/distributors">
                <ListItemText primary="View Distributors"/>
            </ListItem>
            <Divider/>
            <ListItem button component={Link} to="/distributors/new">
                <ListItemText primary="New Distributor"/>
            </ListItem>
        </List>
    )
}

export default DistSubMenu;