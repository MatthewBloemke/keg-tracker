import React from 'react'
import { Link } from 'react-router-dom'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

const EmployeeSubMenu = () => {

    const style = {
        width: '100%',
        bgcolor: '#1675d1',
        color: "#ffffff",
        paddingLeft: "20px"
    }
    return (
        <List sx={style} component="nav">
            <ListItem button divider component={Link} to="/employees">
                <ListItemText primary="View Employees"/>
            </ListItem>
            <Divider/>
            <ListItem button component={Link} to="/employees/new">
                <ListItemText primary="New Employee"/>
            </ListItem>
        </List>
    )
}

export default EmployeeSubMenu;