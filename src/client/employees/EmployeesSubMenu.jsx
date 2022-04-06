import React from 'react'
import { Link } from 'react-router-dom'
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { ListItemButton } from '@mui/material';

const EmployeeSubMenu = ({closeDrawer}) => {

    const style = {
        paddingLeft: "20px"
    }
    return (
        <List sx={style} component="nav">
            <ListItemButton onClick={closeDrawer} component={Link} to="/employees">
                <ListItemText primary="View Employees"/>
            </ListItemButton>
            <Divider/>
            <ListItemButton onClick={closeDrawer} component={Link} to="/employees/new">
                <ListItemText primary="New Employee"/>
            </ListItemButton>
        </List>
    )
}

export default EmployeeSubMenu;