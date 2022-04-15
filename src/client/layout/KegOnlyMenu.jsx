import React, {useState} from 'react'
import NonAdminSubMenu from '../kegs/NonAdminSubMenu';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ImageListItem from '@mui/material/ImageListItem'
import {ExpandLess, ExpandMore} from '@mui/icons-material'
import { Collapse, Divider } from '@mui/material' 

const KegOnlyMenu = ({closeDrawer}) => {
    const [kegsOpen, setKegsOpen] = useState(false)

    const handleKegClick = () => {
        setKegsOpen(!kegsOpen);
    }
    
    const style = {
        width: "250px",
    }


    return (
        <List sx={style} component="nav">
            <ImageListItem divider>
                <img style={{borderRadius: "5px", marginLeft: "55px", marginTop: "10px", marginBottom: "5px",  width: "50%"}} src='https://res.cloudinary.com/ratebeer/image/upload/w_400,c_limit/brew_20712.jpg' alt="loon juice"/>
            </ImageListItem>
            <Divider/>
            <Divider/>
            <ListItemButton divider onClick={handleKegClick}>
                <ListItemText primary="Kegs"/>
                {kegsOpen ? <ExpandLess/> : <ExpandMore/>}
            </ListItemButton>
            <Collapse in={kegsOpen} timeout="auto" unmountOnExit>
                <NonAdminSubMenu closeDrawer={closeDrawer}/>
            </Collapse>
        </List>
    )

}

export default KegOnlyMenu;