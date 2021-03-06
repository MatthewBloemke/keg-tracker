import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import DistSubMenu from '../distributors/DistSubMenu'
import EmployeeSubMenu from '../employees/EmployeesSubMenu'
import KegSubMenu from '../kegs/KegSubMenu'
import ShippingSubMenu from '../shippingHistory/ShippingSubMenu';
import FlavorsSubMenu from '../flavors/FlavorsSubMenu'
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import {ExpandLess, ExpandMore} from '@mui/icons-material'
import { Collapse, ImageListItem, ListItem } from '@mui/material' 
import FillingSubMenu from '../fillingHistory/FillingSubMenu'

const SideMenu = ({closeDrawer}) => {
    const [kegsOpen, setKegsOpen] = useState(false)
    const [distOpen, setDistOpen] = useState(false);
    const [employeesOpen, setEmployeesOpen] = useState(false);
    const [shippingOpen, setShippingOpen] = useState(false);
    const [flavorsOpen, setFlavorsOpen] = useState(false)
    const [fillingOpen, setFillingOpen] = useState(false);

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
    const handleFlavorsClick = () => {
        setFlavorsOpen(!flavorsOpen)
    }

    const handleFillingClick = () => {
        setFillingOpen(!fillingOpen);
    }
    const style = {
        width: "220px",
        paddingTop: "0"
    }


    return (
        <List sx={style} component="nav">
            <ImageListItem>
                <img style={{borderRadius: "5px", marginLeft: "55px", marginTop: "10px", marginBottom: "5px",  width: "50%"}} src='https://res.cloudinary.com/ratebeer/image/upload/w_400,c_limit/brew_20712.jpg' alt="loon juice"/>
            </ImageListItem>
            <Divider/>
            <Divider/>
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
            <ListItemButton divider onClick={handleFlavorsClick}>
                <ListItemText primary="Flavors"/>
                {flavorsOpen ? <ExpandLess/> : <ExpandMore/>}
            </ListItemButton>
            <Collapse in={flavorsOpen} timeout="auto" unmountOnExit>
                <FlavorsSubMenu closeDrawer={closeDrawer}/>
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
            <ListItemButton divider onClick={handleShippingClick}>
                <ListItemText primary="Shipping"/>
                {shippingOpen ? <ExpandLess/> : <ExpandMore/>}
            </ListItemButton>
            <Collapse in={shippingOpen} timeout="auto" unmountOnExit>
                <ShippingSubMenu closeDrawer={closeDrawer}/>
            </Collapse>
            <Divider/>
            <ListItemButton divider onClick={handleFillingClick}>
                <ListItemText primary="Filling"/>
                {fillingOpen ? <ExpandLess/> : <ExpandMore/>}
            </ListItemButton>
            <Collapse in={fillingOpen} timeout="auto" unmountOnExit>
                <FillingSubMenu closeDrawer={closeDrawer}/>
            </Collapse>
            <Divider/>
        </List>
    )
}

export default SideMenu;