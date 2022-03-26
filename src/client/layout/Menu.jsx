import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import DistSubMenu from '../distributors/DistSubMenu'
import EmployeeSubMenu from '../employees/EmployeesSubMenu'
import KegSubMenu from '../kegs/KegSubMenu'
import ShippingSubMenu from '../shippingHistory/ShippingSubMenu';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { logout } from '../utils/api'
import { useHistory } from "react-router-dom";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ListItemIcon from '@mui/material/ListItemIcon';
import "./menu.css"

const Menu = () => {
    const history = useHistory()
    const [path, setPath] = useState(window.location.pathname.slice(1));
    
    const onClick = ({target}) => {
        console.log(target.innerText.toLowerCase())
        setPath(target.innerText.toLowerCase())
    }

    const onLogout = async () => {
        await logout()
            .then(response => {
                if (response) {
                    history.push("/login")
                } else {
                    console.log('error logging out')
                }
            })
    }

    const style = {
        width: '100%',
        bgcolor: '#1675d1',
        color: "#ffffff"
    }


    return (
                <List sx={style} component="nav">
                    <ListItem button onClick={onClick} component={Link} to="/dashboard">
                        <ListItemText primary="Home"/>
                    </ListItem>
                    <Divider />
                    <ListItem button divider onClick={onClick} component={Link} to="/kegs/list/shipped">
                        <ListItemText primary="Kegs"/>
                    </ListItem>
                    {path.includes("kegs") ? <KegSubMenu/> : null}
                    <Divider/>
                    <ListItem button divider onClick={onClick} component={Link} to="/distributors">
                        <ListItemText primary="Distributors"/>
                    </ListItem>
                    {path.includes("distributors") ? <DistSubMenu/> : null}
                    <Divider/>
                    <ListItem button divider onClick={onClick} component={Link} to="/employees">
                        <ListItemText primary="Employees"/>
                    </ListItem>
                    {path.includes("employees") ? <EmployeeSubMenu/> : null}
                    <Divider/>
                    <ListItem button onClick={onClick} component={Link} to="/shipping">
                        <ListItemText primary="Shipping"/>
                    </ListItem>
                    <Divider/>
                    {path.includes("shipping") ? <ShippingSubMenu/> : null}
                    <ListItem button onClick={onLogout}>
                        <ListItemText primary="Logout"/>
                        <ListItemIcon>
                            <ExitToAppIcon className="icon"/>
                        </ListItemIcon>
                    </ListItem>
                </List>
    )

}

export default Menu;