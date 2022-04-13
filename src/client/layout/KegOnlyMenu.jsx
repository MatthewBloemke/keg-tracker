import React, {useState} from 'react'
import NonAdminSubMenu from '../kegs/NonAdminSubMenu';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import {ExpandLess, ExpandMore} from '@mui/icons-material'
import { Collapse } from '@mui/material' 

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