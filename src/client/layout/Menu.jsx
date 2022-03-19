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
import "./menu.css"

const Menu = () => {
    const history = useHistory()

    const onClick = ({target}) => {
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

    const buttonStyle = {
        border: "none",
        background: "none",
        color: "white"
    }

    const style = {
        width: '100%',
        bgcolor: 'background.paper'
    }

    const [path, setPath] = useState(window.location.pathname.slice(1))
    return (
        <nav className="navbar navbar-dark align-items-start p-0">
            <div className="container-fluid d-flex flex-column p-0 listMenu">
                <List sx={style} component="nav">
                    <ListItem button>
                        <ListItemText primary="Home"/>
                    </ListItem>
                    <Divider />
                    <ListItem button divider>
                        <ListItemText primay="Kegs"/>
                    </ListItem>
                    
                </List>
                {/* <li>
                    <Link to="/">
                        <button style={buttonStyle} onClick={onClick}>Home</button>
                    </Link>
                </li>
                <li>
                    <Link to="/kegs">
                        <button style={buttonStyle} onClick={onClick}>Kegs</button>
                    </Link>
                    
                </li>
                {path.includes("kegs") ? <KegSubMenu/> : null}
                <li>
                    <Link to="/distributors">
                        <button style={buttonStyle} onClick={onClick}>Distributors</button>
                    </Link>
                    
                </li>
                {path.includes("distributors") ? <DistSubMenu/> : null}
                <li>
                    <Link to="/employees">
                        <button style={buttonStyle} onClick={onClick}>Employees</button>
                    </Link>
                    
                </li>
                {path.includes("employees") ? <EmployeeSubMenu/> : null}
                <li>
                    <Link to="/shipping">
                        <button style={buttonStyle} onClick={onClick}>Shipping</button>
                    </Link>
                    
                </li>
                {path.includes("shipping") ? <ShippingSubMenu/> : null}
                <li>
                    <button style={buttonStyle} onClick={onLogout}>Logout</button>
                </li> */}
            </div>

        </nav>
    )

}

export default Menu;