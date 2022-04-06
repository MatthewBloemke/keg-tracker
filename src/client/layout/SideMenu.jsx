import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import DistSubMenu from '../distributors/DistSubMenu'
import EmployeeSubMenu from '../employees/EmployeesSubMenu'
import KegSubMenu from '../kegs/KegSubMenu'
import ShippingSubMenu from '../shippingHistory/ShippingSubMenu';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { logout } from '../utils/api'
import { useHistory } from "react-router-dom";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ListItemIcon from '@mui/material/ListItemIcon';
import {ExpandLess, ExpandMore} from '@mui/icons-material'
import { Collapse } from '@mui/material' 
import "./menu.css"

const SideMenu = ({closeDrawer}) => {
    const history = useHistory()
    const [path, setPath] = useState(window.location.pathname.slice(1));
    const [kegsOpen, setKegsOpen] = useState(false)
    const [distOpen, setDistOpen] = useState(false);
    const [employeesOpen, setEmployeesOpen] = useState(false);
    const [shippingOpen, setShippingOpen] = useState(false);

    const handleKegClick = () => {
        setKegsOpen(!kegsOpen);
    }
    const handleDistClick = () => {
        setDistOpen(!distOpen);
    }
    const handleEmployeesClick = () => {
        setEmployeesOpen(!employeesOpen);
    }
    const handleShippingClick = () => {
        setShippingOpen(!shippingOpen);
    }

    
    const style = {
        width: "250px",
    }


    return (
                <List sx={style} component="nav">
                    <ListItemButton divider onClick={closeDrawer} component={Link} to="/dashboard">
                        <ListItemText primary="Home"/>
                    </ListItemButton>
                    <Divider />
                    <ListItemButton divider onClick={handleKegClick}>
                        <ListItemText primary="Kegs"/>
                        {kegsOpen ? <ExpandLess/> : <ExpandMore/>}
                    </ListItemButton>
                    <Collapse in={kegsOpen} timeout="auto" unmountOnExit>
                        <KegSubMenu closeDrawer={closeDrawer}/>
                    </Collapse>
                    <Divider/>
                    <ListItemButton divider onClick={handleDistClick}>
                        <ListItemText primary="Distributors"/>
                        {distOpen ? <ExpandLess/> : <ExpandMore/>}
                    </ListItemButton>
                    <Collapse in={distOpen} timeout="auto" unmountOnExit>
                        <DistSubMenu closeDrawer={closeDrawer}/>
                    </Collapse>
                    <Divider/>
                    <ListItemButton divider onClick={handleEmployeesClick}>
                        <ListItemText primary="Employees"/>
                        {employeesOpen ? <ExpandLess/> : <ExpandMore/>}
                    </ListItemButton>
                    <Collapse in={employeesOpen} timeout='auto' unmountOnExit>
                        <EmployeeSubMenu closeDrawer={closeDrawer}/>
                    </Collapse>
                    <Divider/>
                    <ListItemButton onClick={handleShippingClick}>
                        <ListItemText primary="Shipping"/>
                        {shippingOpen ? <ExpandLess/> : <ExpandMore/>}
                    </ListItemButton>
                    <Collapse in={shippingOpen} timeout="auto" unmountOnExit>
                        <ShippingSubMenu closeDrawer={closeDrawer}/>
                    </Collapse>
                </List>
    )

}

export default SideMenu;